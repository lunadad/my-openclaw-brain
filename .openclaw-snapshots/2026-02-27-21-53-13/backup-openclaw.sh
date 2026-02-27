#!/usr/bin/env bash
set -euo pipefail

# 1) 기본 값 설정
OPENCLAW_DIR="$HOME/.openclaw"
BACKUP_REPO_DIR="$HOME/.openclaw/github-backup"  # 이미 clone 되어 있음 (my-openclaw-brain)

# 필요시 수정: 원래 레포 경로로 맞추고 싶다면 다음 라인으로 변경
# BACKUP_REPO_DIR="$HOME/my-openclaw-brain"

if [ ! -d "$OPENCLAW_DIR" ]; then
  echo "[ERROR] $OPENCLAW_DIR 디렉터리를 찾을 수 없습니다." >&2
  exit 1
fi

if [ ! -d "$BACKUP_REPO_DIR/.git" ]; then
  echo "[ERROR] $BACKUP_REPO_DIR 에 Git 레포가 없습니다. 먼저 my-openclaw-brain 레포를 clone 해 주세요." >&2
  exit 1
fi

cd "$BACKUP_REPO_DIR"

echo "[INFO] 최신 main 브랜치 가져오는 중..."
git pull --rebase origin main || true

# 2) 타임스탬프(사실상 시점 복원용 태그)
STAMP="$(date +"%Y-%m-%d-%H-%M-%S")"

# 3) .openclaw 전체를 레포 안에 미러링 (.git, _backups 등 민감 디렉터리는 제외)
TARGET_DIR=".openclaw-snapshots/$STAMP"
mkdir -p "$TARGET_DIR"

# rsync를 사용해 불필요한 것 제외 (특히 Git 리포나 백업의 무한 복사 방지)
rsync -a \
  --exclude='.git' \
  --exclude='_backups' \
  --exclude='github-backup' \
  "$OPENCLAW_DIR/" "$TARGET_DIR/"

# 4) 현재 활성 설정도 편의를 위해 루트에 복사 / 동기화
#    (늘 최신 상태를 보고 싶을 때 사용)
mkdir -p .openclaw-current
rsync -a \
  --exclude='.git' \
  --exclude='_backups' \
  --exclude='github-backup' \
  "$OPENCLAW_DIR/" .openclaw-current/

# 5) Git 커밋 + 푸시

echo "[INFO] 변경 사항 스테이징..."
git add .openclaw-snapshots "$TARGET_DIR" .openclaw-current || true

if git diff --cached --quiet; then
  echo "[INFO] 커밋할 변경이 없습니다. 종료합니다."
  exit 0
fi

COMMIT_MSG="chore: openclaw snapshot $STAMP"

echo "[INFO] 커밋 생성: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "[INFO] 원격 저장소로 푸시 중..."
git push origin main

echo "[INFO] 완료! 시점 스냅샷이 GitHub에 저장되었습니다: $STAMP"
