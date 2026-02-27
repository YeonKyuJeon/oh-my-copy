# Release Guide

이 저장소는 `v*` 태그 푸시 시 GitHub Actions가 자동으로 VSIX를 빌드하고 GitHub Release에 첨부합니다.

워크플로 파일: `.github/workflows/release.yml`

## 1. 사전 준비 (한 번만)

1. GitHub 저장소에 push 권한 확인
2. (선택) Marketplace 자동 배포를 원하면 repository secret 추가
   - 이름: `VSCE_PAT`
   - 값: Visual Studio Marketplace Personal Access Token

## 2. 버전 올리기

`package.json`의 `version`을 다음 버전으로 올립니다.

예: `1.1.0` -> `1.1.1`

## 3. 커밋

```bash
git add package.json CHANGELOG.md README.md RELEASE.md .github/workflows/release.yml
git commit -m "chore: release v1.1.1"
```

## 4. 태그 생성 및 푸시

```bash
git tag v1.1.1
git push origin main
git push origin v1.1.1
```

또는 한 번에:

```bash
git push origin main --tags
```

## 5. 자동 배포 결과

태그 푸시 후 Actions가 다음을 수행합니다.

1. `bun install --frozen-lockfile`
2. `bun run compile`
3. `dist/oh-my-copy-vX.Y.Z.vsix` 생성
4. GitHub Release 생성 + VSIX 첨부
5. (선택) `VSCE_PAT`가 있으면 Marketplace publish

## 6. 외부 사용자 설치 방법

외부 사용자는 Release에서 `.vsix`를 받아 설치하면 됩니다.

```bash
code --install-extension ./oh-my-copy-v1.1.1.vsix
```

Antigravity:

```bash
antigravity --install-extension ./oh-my-copy-v1.1.1.vsix
```
