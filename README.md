# oh-my-copy

`oh-my-copy` is a VS Code extension that copies your selected code with file/line context for external tools like Codex CLI.

## Default Output

```txt
### src/components/Button.tsx:42-45

const handleClick = () => {
  // ...
}
```

Default template:

```txt
### {file}:{lines}

{code}
```

## Commands

- `Oh My Copy: Copy With Context` (`oh-my-copy.copyWithContext`)

## Default Keybinding

- macOS: `ctrl+cmd+c`
- Windows/Linux: `ctrl+alt+c`

## Settings

- `ohMyCopy.outputTemplate`
  - Output template. Placeholders: `{file}`, `{lines}`, `{code}`
- `ohMyCopy.includeLineRangeForMultiline`
  - `true` by default. Uses `start-end` for multiline selections
- `ohMyCopy.copyCommand`
  - Optional shell command. If set, output is piped to this command via stdin
  - Leave empty to use VS Code clipboard API directly
- `ohMyCopy.showNotification`
  - Show success message after copying

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

This creates a `.vsix` package using `vsce`.

## Publish to GitHub

```bash
git init
git add .
git commit -m "feat: init oh-my-copy extension"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
