import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { basename } from 'node:path';
import * as vscode from 'vscode';

const EXTENSION_COMMAND_ID = 'oh-my-copy.copyWithContext';

interface ExtensionConfig {
  antigravityCopyCommand: string
  compactCodeToSingleLine: boolean
  copyCommand: string
  enableAntigravityClipboardFallback: boolean
  includeLineRangeForMultiline: boolean
  outputTemplate: string
  showNotification: boolean
}

interface TemplateValues {
  code: string
  file: string
  lines: string
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    EXTENSION_COMMAND_ID,
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        await vscode.window.showWarningMessage('No active editor found.');
        return;
      }

      const selectedText = editor.document.getText(editor.selection);

      if (!selectedText.trim()) {
        await vscode.window.showWarningMessage(
          'Select code before running Oh My Copy.'
        );
        return;
      }

      const config = getExtensionConfig();
      const file = getRelativeFilePath(editor.document.uri);
      const lines = getLineLabel(
        editor.selection,
        selectedText,
        config.includeLineRangeForMultiline
      );
      const codeForOutput = config.compactCodeToSingleLine
        ? compactToSingleLine(selectedText)
        : selectedText;
      const codeAsTemplateLiteral = wrapAsTemplateLiteral(codeForOutput);
      const output = formatOutput(config.outputTemplate, {
        code: codeAsTemplateLiteral,
        file,
        lines,
      }).replace(/[\r\n]+$/, '');

      const preferredCopyCommand = resolvePreferredCopyCommand(config);
      const copiedWithCustomCommand = preferredCopyCommand
        ? await copyWithCommand(preferredCopyCommand, output)
        : false;

      if (!copiedWithCustomCommand) {
        await vscode.env.clipboard.writeText(output);
      }

      if (config.showNotification) {
        await vscode.window.showInformationMessage(
          'Copied selection with context to clipboard.'
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function formatOutput(template: string, values: TemplateValues): string {
  return template
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
    copyCommand: config.get<string>('copyCommand', '').trim(),
    enableAntigravityClipboardFallback: config.get<boolean>(
      'enableAntigravityClipboardFallback',
      true
    ),
    includeLineRangeForMultiline: config.get<boolean>(
      'includeLineRangeForMultiline',
      true
    ),
    outputTemplate: config.get<string>(
      'outputTemplate',
      '### {file}:{lines} {code}'
    ),
    showNotification: config.get<boolean>('showNotification', true),
  };
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

function getLineLabel(
  selection: vscode.Selection,
  selectedText: string,
  includeLineRangeForMultiline: boolean
): string {
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

  if (!includeLineRangeForMultiline || startLine === endLine) {
    return startLine.toString();
  }

  return `${startLine}-${endLine}`;
}

function getRelativeFilePath(uri: vscode.Uri): string {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

  if (!workspaceFolder) {
    return basename(uri.fsPath);
  }

  return vscode.workspace.asRelativePath(uri, false);
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
