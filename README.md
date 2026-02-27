# oh-my-copy

`oh-my-copy` is a VS Code extension that copies selected code with file/line context for external tools like Codex CLI.

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

## Quick Start (External Users)

1. 릴리즈 페이지에서 최신 `.vsix` 파일 다운로드
2. 에디터에 확장 설치
3. 코드 선택 후 단축키 실행
4. 원하는 CLI/채팅 도구에 붙여넣기

```bash
# VS Code
code --install-extension ./oh-my-copy-v1.1.1.vsix

# Antigravity
antigravity --install-extension ./oh-my-copy-v1.1.1.vsix
```

사용 방법:

1. 파일에서 코드 블록을 선택
2. 단축키 실행
   - macOS: `ctrl+cmd+alt+c`
   - Windows/Linux: `ctrl+alt+c`
3. 복사된 문자열을 Codex CLI 등에 붙여넣기

## Default Output

```txt
### src/components/Button.tsx:42-45 `const handleClick = () => { // ... }`
```

Default template:

```txt
### {file}:{lines} {code}
```

## Commands

- `Oh My Copy: Copy With Context` (`oh-my-copy.copyWithContext`)

## Default Keybinding

- macOS: `ctrl+cmd+alt+c`
- Windows/Linux: `ctrl+alt+c`

## Settings

- `ohMyCopy.outputTemplate`
  - Output template. Placeholders: `{file}`, `{lines}`, `{code}`
  - `{code}` is inserted wrapped in a template literal (backticks)
- `ohMyCopy.compactCodeToSingleLine`
  - `true` by default. Collapses multiline/extra spaces into one line before injecting `{code}`
- `ohMyCopy.enableAntigravityClipboardFallback`
  - `true` by default. In Antigravity, prefer shell clipboard command fallback
- `ohMyCopy.antigravityCopyCommand`
  - Optional Antigravity-specific copy command. If empty:
  - macOS: `pbcopy`, Windows: `clip`, Linux: `xclip -selection clipboard`
- `ohMyCopy.includeLineRangeForMultiline`
  - `true` by default. Uses `start-end` for multiline selections
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
