# Changelog

## 1.2.2

- Changed output prefix to `FILE:` for clearer AI CLI parsing
- Added `ohMyCopy.contextPrefix` to customize the prefix label (for example `CTX:`, `PATH:`)
- Added empty-selection behavior: command now copies `{prefix} {file}` (default `FILE: {file}`)
- Restored multiline suffix range format (for example `app.ts:20-22`)
- Updated keybinding condition to work without selection (`editorTextFocus && !terminalFocus`)
- Added absolute-path copy command (`oh-my-copy.copyWithAbsoluteContext`) with default keybinding `ctrl+cmd+alt+d` on macOS (`ctrl+alt+d` on Windows/Linux)

## 1.2.1

- Changed output behavior by selection size: single-line keeps `FILE: {file}:{lines} {code}`, multiline now outputs only `FILE: {file}:{lines}`
- Clarified docs/config that `ohMyCopy.outputTemplate` and `{code}` apply to single-line output

## 0.1.2

- Added automatic Antigravity runtime detection
- Added `ohMyCopy.enableAntigravityClipboardFallback` setting (default `true`)
- Added `ohMyCopy.antigravityCopyCommand` setting with OS defaults
- Changed `{code}` output to be wrapped as a template literal

## 0.1.1

- Changed default copy output to a single-line format (`FILE: {file}:{lines} {code}`)
- Added `ohMyCopy.compactCodeToSingleLine` setting (default `true`)

## 0.1.0

- Added `oh-my-copy.copyWithContext` command
- Added default keybinding (`ctrl+cmd+alt+c` on macOS)
- Added configurable output template (`ohMyCopy.outputTemplate`)
- Added multiline line-range option (`ohMyCopy.includeLineRangeForMultiline`)
- Added optional shell-based copy command (`ohMyCopy.copyCommand`)
