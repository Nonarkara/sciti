#!/usr/bin/env bash
# Preview deploy of THIS repo onto the Cloudflare Pages project that serves
# https://sciti.nonarkara.org. It does not promote production and it does not
# git commit. Do not put a token in this file.
#
#   export CLOUDFLARE_API_TOKEN=...    # Pages: Edit on the account
#   export CLOUDFLARE_ACCOUNT_ID=...   # the account that owns the project
#   bash scripts/deploy-cf.sh
#
# Caps, Free plan, checked against Cloudflare's Pages limits page (updated
# 5 Sep 2026) and the Pages Functions pricing page (updated 8 Sep 2026):
#   - static asset requests and bandwidth: unlimited, not billed
#   - builds: 500 a month, 1 at a time, 20 minute timeout
#   - files: 20,000 per site, 25 MiB each
#   - custom domains: 100 per project
#   - _redirects: 2,000 static and 100 dynamic
#   - Pages Functions are billed as Workers (100,000 requests a day on the
#     Workers Free plan). This upload has none. The old repo's functions/api
#     is not in dist, and wrangler here deploys dist only.
# There is no Workers paid plan, KV, D1, Durable Objects, R2, or image
# resizing in this script. If the preview's /api/cities still returns the old
# composite, the project is still invoking a Function from somewhere else.
# Remove that before any promotion. Do not buy a plan to keep it.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DOMAIN="https://sciti.nonarkara.org"
CF_PROJECT="smart-city-thailand-index"
BRANCH="preview-v2"

bold(){ printf "\n\033[1m▸ %s\033[0m\n" "$*"; }
ok(){   printf "  \033[32m✓\033[0m %s\n" "$*"; }
die(){  printf "\n\033[31m✗ deploy-cf aborted: %s\033[0m\n" "$*" >&2; exit 1; }

if [[ "${1:-}" == "--promote" ]]; then
  die "this script does not promote. Production stays on the previous deployment until you roll the preview forward by hand."
fi
if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  die "CLOUDFLARE_API_TOKEN is not set. Export it in the shell that runs this script."
fi
if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  die "CLOUDFLARE_ACCOUNT_ID is not set. Export it in the shell that runs this script."
fi

LOG_DIR="$ROOT/.tmp"
mkdir -p "$LOG_DIR"

bold "Preflight — redirects file"
node scripts/write-cf-redirects.mjs

bold "Preflight — tests"
npm test >"$LOG_DIR/cf-test.log" 2>&1 || { tail -30 "$LOG_DIR/cf-test.log"; die "tests failed"; }
ok "node tests passed"

bold "Preflight — lint"
npm run lint >"$LOG_DIR/cf-lint.log" 2>&1 || { tail -20 "$LOG_DIR/cf-lint.log"; die "lint failed"; }
ok "eslint clean"

bold "Preflight — build (base=/, no GitHub Pages prefix)"
env -u GITHUB_ACTIONS npm run build >"$LOG_DIR/cf-build.log" 2>&1 || { tail -30 "$LOG_DIR/cf-build.log"; die "build failed"; }
LOCAL_HASH="$(grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
[[ -n "$LOCAL_HASH" ]] || die "could not read the built script from dist/index.html"
ok "built $LOCAL_HASH"
[[ -f dist/_redirects ]] || die "dist/_redirects missing"
[[ -f dist/404.html ]] || die "dist/404.html missing"
[[ -f dist/api-gone.json ]] || die "dist/api-gone.json missing"
[[ ! -d dist/functions ]] || die "dist/functions would upload Pages Functions"
if grep -qE 'unpkg|fonts.googleapis.com|fonts.gstatic.com' dist/index.html; then
  die "dist/index.html still points at unpkg or Google Fonts"
fi
ok "static dist: redirects, 404, no functions, no font host"

bold "Deploy — preview branch only ($BRANCH)"
# --commit-dirty lets wrangler upload when the worktree is dirty. It does not commit.
npx --yes wrangler pages deploy dist \
  --project-name="$CF_PROJECT" \
  --branch="$BRANCH" \
  --commit-dirty=true \
  >"$LOG_DIR/cf-deploy.log" 2>&1 || { tail -40 "$LOG_DIR/cf-deploy.log"; die "wrangler preview deploy failed"; }
tail -20 "$LOG_DIR/cf-deploy.log"
PREVIEW="$(grep -oE 'https://[A-Za-z0-9._-]+\.pages\.dev' "$LOG_DIR/cf-deploy.log" | head -1)"
[[ -n "$PREVIEW" ]] || die "wrangler did not print a pages.dev URL"
ok "preview $PREVIEW"

bold "Smoke — preview URL, not $DOMAIN"
html="$(curl -fsS "$PREVIEW/" )" || die "preview / did not return the page"
grep -q "$LOCAL_HASH" <<<"$html" || die "preview is not serving $LOCAL_HASH"
ok "preview serves the new script"

code="$(curl -s -o /dev/null -w '%{http_code}' "$PREVIEW/bingo")"
[[ "$code" == "302" ]] || die "/bingo returned HTTP $code, expected 302"
ok "/bingo → 302"

loc="$(curl -s -o /dev/null -D - "$PREVIEW/city/phuket" | awk 'tolower($1)=="location:" { print $2 }' | tr -d '\r')"
[[ "$loc" == */place/th-83 ]] || die "/city/phuket redirected to ${loc:-<none>}"
ok "/city/phuket → /place/th-83"

missing="$(curl -s -o /dev/null -w '%{http_code}' "$PREVIEW/no-such-page")"
[[ "$missing" == "404" ]] || die "/no-such-page returned HTTP $missing, expected 404"
ok "/no-such-page → 404"

api_body="$(curl -s "$PREVIEW/api/cities")"
api_code="$(curl -s -o /dev/null -w '%{http_code}' "$PREVIEW/api/cities")"
[[ "$api_code" == "404" ]] || die "/api/cities returned HTTP $api_code, expected 404"
if grep -q 'compositeScore' <<<"$api_body"; then
  die "/api/cities still returns the old composite. A Pages Function is still attached. Do not promote."
fi
ok "/api/cities is not the old composite"

chunk_fail=0
for f in dist/assets/*.js; do
  name="$(basename "$f")"
  ctype="$(curl -s -o /dev/null -w '%{content_type}' "$PREVIEW/assets/$name")"
  case "$ctype" in
    *javascript*) ;;
    *) printf "  \033[31m✗\033[0m %s → %s\n" "$name" "${ctype:-<none>}"; chunk_fail=$((chunk_fail+1)) ;;
  esac
done
[[ "$chunk_fail" = 0 ]] || die "$chunk_fail script(s) are not JavaScript"
ok "scripts are served as JavaScript"

bold "Slop lint — preview"
node tools/slop-lint.mjs "$PREVIEW/" >"$LOG_DIR/cf-slop.log" 2>&1 || { tail -30 "$LOG_DIR/cf-slop.log"; die "slop-lint failed"; }
tail -15 "$LOG_DIR/cf-slop.log"
ok "slop lint finished"

printf "\n\033[1;32m✓ Preview is up at %s\033[0m\n" "$PREVIEW"
printf "Production %s was not changed.\n" "$DOMAIN"
cat <<EOF

Promote only after you have opened the preview in English, Thai and Chinese.
This script will not do it.

  npx wrangler pages deploy dist --project-name=$CF_PROJECT --branch=main --commit-dirty=true

Rollback: in the Pages project $CF_PROJECT, open Deployments and roll production
back to the deployment that was live before the promotion. Do not delete that
deployment. DNS does not have to move.

EOF
