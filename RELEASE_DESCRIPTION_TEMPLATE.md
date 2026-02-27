# oh-my-copy vX.Y.Z

`oh-my-copy` release `vX.Y.Z`

## What Changed

- (필수) 이번 버전 변경 사항 1
- (필수) 이번 버전 변경 사항 2
- (선택) 버그 수정/개선 사항

## Install (Marketplace)

- https://marketplace.visualstudio.com/items?itemName=oh-my-copy.oh-my-copy

## Install (VSIX for External Users)

1. 아래 VSIX 파일 다운로드  
   `oh-my-copy-vX.Y.Z.vsix`
2. VS Code 설치:

```bash
code --install-extension ./oh-my-copy-vX.Y.Z.vsix
```

3. Antigravity 설치:

```bash
antigravity --install-extension ./oh-my-copy-vX.Y.Z.vsix
```

직접 다운로드 링크:

```txt
https://github.com/YeonKyuJeon/oh-my-copy/releases/download/vX.Y.Z/oh-my-copy-vX.Y.Z.vsix
```

## Usage

1. 코드 선택
2. 단축키 실행
   - macOS: `ctrl+cmd+alt+c`
   - Windows/Linux: `ctrl+alt+c`
3. 복사된 문자열을 Codex CLI 등 외부 도구에 붙여넣기

출력 예시:

```txt
### src/components/Button.tsx:42-45 `const handleClick = () => { // ... }`
```

## Notes

- (선택) 호환성 주의사항
- (선택) 알려진 이슈
