# Manual Install Guide (VSIX)

마켓플레이스에서 설치가 안 될 때 `VSIX` 파일로 직접 설치할 수 있습니다.

## 1. VSIX 파일 준비

다음 중 하나를 사용하세요.

1. GitHub Release에서 `oh-my-copy-<version>.vsix` 다운로드
2. 소스에서 직접 빌드

```bash
bun install
bun run compile
bun run package
```

빌드 후 루트에 `oh-my-copy-<version>.vsix` 파일이 생성됩니다.

## 2. GUI로 설치

### VS Code

1. Extensions 탭 열기
2. 우측 상단 `...` 클릭
3. `Install from VSIX...` 선택
4. `oh-my-copy-<version>.vsix` 선택

### Antigravity

1. Extensions 탭 열기
2. 우측 상단 `...` 클릭
3. `Install from VSIX...` 선택
4. `oh-my-copy-<version>.vsix` 선택

## 3. CLI로 설치

### VS Code

```bash
code --install-extension ./oh-my-copy-<version>.vsix
```

### Antigravity

PATH에 `antigravity`가 있으면:

```bash
antigravity --install-extension ./oh-my-copy-<version>.vsix
```

PATH가 없으면:

```bash
/Applications/Antigravity.app/Contents/Resources/app/bin/antigravity \
  --install-extension ./oh-my-copy-<version>.vsix
```

## 4. 업데이트

새 버전 VSIX로 덮어설치하면 됩니다.

```bash
code --install-extension ./oh-my-copy-<new-version>.vsix --force
```

```bash
antigravity --install-extension ./oh-my-copy-<new-version>.vsix --force
```

## 5. 제거

확장 ID: `oh-my-copy.oh-my-copy`

```bash
code --uninstall-extension oh-my-copy.oh-my-copy
```

```bash
antigravity --uninstall-extension oh-my-copy.oh-my-copy
```

## 6. 설치 확인

1. Command Palette에서 `Oh My Copy: Copy With Context` 검색
2. 코드 선택 후 단축키 실행
   - macOS: `ctrl+cmd+alt+c`
   - Windows/Linux: `ctrl+alt+c`

## 7. 팀 공유 권장 방식

1. VSIX를 GitHub Releases에 업로드
2. 릴리즈 노트에 설치 방법 링크 추가
3. 이 문서(`MANUAL_INSTALL.md`)를 함께 공유
