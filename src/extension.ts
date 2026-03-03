import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { basename } from 'node:path';
import * as vscode from 'vscode';

const EXTENSION_COMMAND_ID = 'oh-my-copy.copyWithContext';
const EXTENSION_ABSOLUTE_COMMAND_ID = 'oh-my-copy.copyWithAbsoluteContext';
const DEFAULT_CONTEXT_PREFIX = 'FILE:';

interface ExtensionConfig {
  antigravityCopyCommand: string
  compactCodeToSingleLine: boolean
  contextPrefix: string
  copyCommand: string
  enableAntigravityClipboardFallback: boolean
  outputTemplate: string
  showNotification: boolean
}

interface TemplateValues {
  code: string
  file: string
  lines: string
  prefix: string
}

interface SelectionLineBounds {
  end: number
  start: number
}

export function activate(context: vscode.ExtensionContext) {
  const copyWithContextDisposable = vscode.commands.registerCommand(
    EXTENSION_COMMAND_ID,
    async () => {
      await copyWithEditorContext(false);
    }
  );
  const copyWithAbsoluteContextDisposable = vscode.commands.registerCommand(
    EXTENSION_ABSOLUTE_COMMAND_ID,
    async () => {
      await copyWithEditorContext(true);
    }
  );

  context.subscriptions.push(
    copyWithContextDisposable,
    copyWithAbsoluteContextDisposable
  );
}

export function deactivate() {}

function formatOutput(template: string, values: TemplateValues): string {
  return template
    .replaceAll('{prefix}', values.prefix)
    .replaceAll('{file}', values.file)
    .replaceAll('{lines}', values.lines)
    .replaceAll('{code}', values.code);
}

function getExtensionConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration('ohMyCopy');

  return {
    antigravityCopyCommand: config.get<string>('antigravityCopyCommand', '').trim(),
    compactCodeToSingleLine: config.get<boolean>(
      'compactCodeToSingleLine',
      true
    ),
    contextPrefix: getContextPrefix(
      config.get<string>('contextPrefix', DEFAULT_CONTEXT_PREFIX)
    ),
    copyCommand: config.get<string>('copyCommand', '').trim(),
    enableAntigravityClipboardFallback: config.get<boolean>(
      'enableAntigravityClipboardFallback',
      true
    ),
    outputTemplate: config.get<string>(
      'outputTemplate',
      '{prefix} {file}:{lines} {code}'
    ),
    showNotification: config.get<boolean>('showNotification', true),
  };
}

async function copyWithEditorContext(useAbsolutePath: boolean): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    await vscode.window.showWarningMessage('No active editor found.');
    return;
  }

  const config = getExtensionConfig();
  const file = getFilePath(editor.document.uri, useAbsolutePath);
  let output = formatOutput('{prefix} {file}', {
    code: '',
    file,
    lines: '',
    prefix: config.contextPrefix,
  });
  let notificationMessage = 'Copied file path to clipboard.';

  if (!editor.selection.isEmpty) {
    const selectedText = editor.document.getText(editor.selection);

    if (!selectedText.trim()) {
      await vscode.window.showWarningMessage(
        'Select code before running Oh My Copy.'
      );
      return;
    }

    const selectionLineBounds = getSelectionLineBounds(
      editor.selection,
      selectedText
    );
    const lines = getLineLabel(selectionLineBounds);
    const isSingleLineSelection =
      selectionLineBounds.start === selectionLineBounds.end;
    const codeForOutput = config.compactCodeToSingleLine
      ? compactToSingleLine(selectedText)
      : selectedText;
    const codeAsTemplateLiteral = wrapAsTemplateLiteral(codeForOutput);
    // For multiline selections, only send location context to reduce prompt noise.
    const template = isSingleLineSelection
      ? config.outputTemplate
      : '{prefix} {file}:{lines}';

    output = formatOutput(template, {
      code: isSingleLineSelection ? codeAsTemplateLiteral : '',
      file,
      lines,
      prefix: config.contextPrefix,
    }).trimEnd();
    notificationMessage = 'Copied file context to clipboard.';
  }

  const preferredCopyCommand = resolvePreferredCopyCommand(config);
  const copiedWithCustomCommand = preferredCopyCommand
    ? await copyWithCommand(preferredCopyCommand, output)
    : false;

  if (!copiedWithCustomCommand) {
    await vscode.env.clipboard.writeText(output);
  }

  if (config.showNotification) {
    await vscode.window.showInformationMessage(notificationMessage);
  }
}

function getContextPrefix(prefix: string): string {
  const normalized = prefix.trim();

  if (!normalized) {
    return DEFAULT_CONTEXT_PREFIX;
  }

  return normalized;
}

function compactToSingleLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function wrapAsTemplateLiteral(text: string): string {
  const escaped = text.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  return `\`${escaped}\``;
}

function resolvePreferredCopyCommand(config: ExtensionConfig): string {
  if (config.copyCommand) {
    return config.copyCommand;
  }

  if (!config.enableAntigravityClipboardFallback || !isAntigravityEditor()) {
    return '';
  }

  if (config.antigravityCopyCommand) {
    return config.antigravityCopyCommand;
  }

  return getPlatformClipboardCommand();
}

function isAntigravityEditor(): boolean {
  const normalized = `${vscode.env.appName} ${vscode.env.uriScheme}`.toLowerCase();

  return normalized.includes('antigravity');
}

function getPlatformClipboardCommand(): string {
  const currentPlatform = platform();

  if (currentPlatform === 'darwin') {
    return 'pbcopy';
  }

  if (currentPlatform === 'win32') {
    return 'clip';
  }

  return 'xclip -selection clipboard';
}

function getLineLabel(bounds: SelectionLineBounds): string {
  if (bounds.start === bounds.end) {
    return bounds.start.toString();
  }

  return `${bounds.start}-${bounds.end}`;
}

function getSelectionLineBounds(
  selection: vscode.Selection,
  selectedText: string
): SelectionLineBounds {
  const startLine = selection.start.line + 1;
  let endLine = selection.end.line + 1;

  if (
    selection.end.character === 0 &&
    selection.end.line > selection.start.line &&
    selectedText.endsWith('\n')
  ) {
    endLine -= 1;
  }

  if (endLine < startLine) {
    endLine = startLine;
  }

  return {
    end: endLine,
    start: startLine,
  };
}

function getRelativeFilePath(uri: vscode.Uri): string {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

  if (!workspaceFolder) {
    return basename(uri.fsPath);
  }

  return vscode.workspace.asRelativePath(uri, false);
}

function getFilePath(uri: vscode.Uri, useAbsolutePath: boolean): string {
  if (useAbsolutePath) {
    return uri.fsPath;
  }

  return getRelativeFilePath(uri);
}

async function copyWithCommand(command: string, content: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      stdio: ['pipe', 'ignore', 'pipe'],
    });

    let errorOutput = '';

    child.stderr.on('data', (chunk: Buffer) => {
      errorOutput += chunk.toString();
    });

    child.on('error', () => {
      resolve(false);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(true);
        return;
      }

      if (errorOutput.trim()) {
        void vscode.window.showWarningMessage(
          `copyCommand failed. Falling back to clipboard API. ${errorOutput.trim()}`
        );
      }

      resolve(false);
    });

    child.stdin.write(content);
    child.stdin.end();
  });
}
