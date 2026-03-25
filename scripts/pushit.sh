#!/usr/bin/env bash
# PUSHIT — stage all, commit (if needed), push GitHub main, deploy Vercel production.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
MSG="${1:-chore: PUSHIT — sync GitHub + Vercel}"

git add -A
if git diff --cached --quiet; then
  echo "PUSHIT: no file changes to commit"
else
  git commit -m "$MSG"
fi

git push origin main
npx --yes vercel@latest deploy --prod --yes --scope brian-blairs-projects-db49a920
echo "PUSHIT: finished (GitHub push + Vercel production deploy)."
