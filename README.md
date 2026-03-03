# oh-my-copy

`oh-my-copy` is a VS Code extension that copies selected code with file/line context for external tools like Codex CLI. By default it uses `FILE:` records, and you can change the prefix via `ohMyCopy.contextPrefix`.

## Install

### 1) VS Code Marketplace (recommended)

- Install from Marketplace: https://marketplace.visualstudio.com/items?itemName=oh-my-copy.oh-my-copy

### 2) GitHub Release VSIX (works without Marketplace)

1. Open Releases: https://github.com/YeonKyuJeon/oh-my-copy/releases
2. Download `oh-my-copy-<version>.vsix`
3. Install the VSIX:

```bash
code --install-extension ./oh-my-copy-<version>.vsix
```

For Antigravity:

```bash
antigravity --install-extension ./oh-my-copy-<version>.vsix
```

For Cursor:

```bash
cursor --install-extension ./oh-my-copy-<version>.vsix
```

## Quick Start (External Users)

1. 릴리즈 페이지에서 최신 `.vsix` 파일 다운로드
2. 에디터에 확장 설치
3. 코드 선택 후 단축키 실행
4. 원하는 CLI/채팅 도구에 붙여넣기

```bash
# VS Code
code --install-extension ./oh-my-copy-v1.2.2.vsix

# Antigravity
antigravity --install-extension ./oh-my-copy-v1.2.2.vsix

# Cursor
cursor --install-extension ./oh-my-copy-v1.2.2.vsix
```

사용 방법:

1. 파일에서 코드 블록을 선택 (선택이 없으면 파일 경로만 복사)
2. 단축키 실행
   - Relative path: macOS `ctrl+cmd+alt+c`, Windows/Linux `ctrl+alt+c`
   - Absolute path: macOS `ctrl+cmd+alt+d`, Windows/Linux `ctrl+alt+d`
3. 복사된 문자열을 Codex CLI 등에 붙여넣기

## Default Output

No selection:

```txt
FILE: src/components/Button.tsx
```

Single-line selection:

```txt
FILE: src/components/Button.tsx:42 `const handleClick = () => { // ... }`
```

Multiline selection:

```txt
FILE: src/components/Button.tsx:42-45
```

Default template (single-line only):

```txt
{prefix} {file}:{lines} {code}
```

If the selection spans 2+ lines, output always ends with a range like `:20-22`.

Absolute-path command example (`ctrl+cmd+alt+d`):

```txt
FILE: /Users/jeonyeonkyu/office/copy-plugin/src/extension.ts:20-22
```

## Commands

- `Oh My Copy: Copy With Context` (`oh-my-copy.copyWithContext`)
- `Oh My Copy: Copy With Absolute Context` (`oh-my-copy.copyWithAbsoluteContext`)

## Default Keybinding

- Relative path
  - macOS: `ctrl+cmd+alt+c`
  - Windows/Linux: `ctrl+alt+c`
- Absolute path
  - macOS: `ctrl+cmd+alt+d`
  - Windows/Linux: `ctrl+alt+d`

## Settings

- `ohMyCopy.outputTemplate`
  - Output template for single-line selections. Placeholders: `{prefix}`, `{file}`, `{lines}`, `{code}`
  - `{prefix}` uses `ohMyCopy.contextPrefix`
  - `{code}` is inserted wrapped in a template literal (backticks)
- `ohMyCopy.contextPrefix`
  - `FILE:` by default
  - Change this to `CTX:` or `PATH:` etc.
  - Used for no selection (`{prefix} {file}`) and multiline (`{prefix} {file}:{lines}`)
- `ohMyCopy.compactCodeToSingleLine`
  - `true` by default. Collapses whitespace before injecting `{code}` (single-line output only)
- `ohMyCopy.enableAntigravityClipboardFallback`
  - `true` by default. In Antigravity, prefer shell clipboard command fallback
- `ohMyCopy.antigravityCopyCommand`
  - Optional Antigravity-specific copy command. If empty:
  - macOS: `pbcopy`, Windows: `clip`, Linux: `xclip -selection clipboard`
- `ohMyCopy.copyCommand`
  - Optional shell command. If set, output is piped to this command via stdin
  - Leave empty to use VS Code clipboard API directly
- `ohMyCopy.showNotification`
  - Show success message after copying

## Antigravity Support

When running in Antigravity (app name contains `antigravity`), `oh-my-copy` can use shell clipboard fallback automatically.

## Development

```bash
bun install
bun run compile
bun run watch
```

## Package

```bash
bun run package
```

## Manual Install (No Marketplace)

- [MANUAL_INSTALL.md](./MANUAL_INSTALL.md)

## Release (Maintainers)

- [RELEASE.md](./RELEASE.md)
- [RELEASE_DESCRIPTION_TEMPLATE.md](./RELEASE_DESCRIPTION_TEMPLATE.md)
