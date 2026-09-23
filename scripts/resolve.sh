#!/usr/bin/env bash
# Mark a feedback issue as accounted for: appends a Resolution line (shown on the site) and closes it with a comment.
# Usage: scripts/resolve.sh <issue-number> "<what changed>" [not_planned]
set -euo pipefail
N="$1"; MSG="$2"; REASON="${3:-completed}"
REPO=okmatija/corl2026
GH="$(command -v gh || echo "/c/Program Files/GitHub CLI/gh.exe")"
BODY="$("$GH" issue view "$N" -R "$REPO" --json body --jq .body)"
BODY="$(printf '%s' "$BODY" | sed '/^---$/,$d')"   # drop any previous resolution
printf '%s\n\n---\n**Resolution:** %s\n' "$BODY" "$MSG" | "$GH" issue edit "$N" -R "$REPO" --body-file -
"$GH" issue close "$N" -R "$REPO" --reason "$REASON" --comment "$MSG"
