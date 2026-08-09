#!/usr/bin/env bash
#
# End-to-end smoke test. Boots the production build against a throwaway SQLite
# database and exercises the full order flow over HTTP.
#
#   bun run test:e2e     # builds, then runs this
#
set -uo pipefail
cd "$(dirname "$0")/.."

if [ ! -f build/index.js ]; then
  echo "build/index.js not found — run 'bun run build' first." >&2
  exit 1
fi

PORT=${PORT:-3517}
ORIGIN="http://localhost:$PORT"
DB=$(mktemp -d)/smoke.sqlite
fail=0

check() { # name, expected, actual
  if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1 (expected '$2', got '$3')"; fail=1; fi
}
contains() { # name, needle, haystack
  if printf '%s' "$3" | grep -qF -- "$2"; then echo "  PASS  $1"; else echo "  FAIL  $1 (missing '$2')"; fail=1; fi
}

DATABASE_PATH="$DB" HOST=127.0.0.1 PORT=$PORT ORIGIN="$ORIGIN" bun ./build/index.js >/tmp/smoke-server.log 2>&1 &
server=$!
trap 'kill $server 2>/dev/null' EXIT

for _ in $(seq 1 50); do
  curl -sf -o /dev/null "$ORIGIN/" && break
  sleep 0.2
done

echo "== migrations =="
[ -f "$DB" ] && echo "  PASS  database created at startup" || { echo "  FAIL  no database file"; fail=1; }

echo "== GET / =="
home=$(curl -s "$ORIGIN/")
check "status" "200" "$(curl -s -o /dev/null -w '%{http_code}' "$ORIGIN/")"
contains "renders the heading" "文化祭 退学願 Tシャツ販売フォーム" "$home"
contains "renders the branch question" "木更津高専生ですか？" "$home"
contains "daisyUI styles are applied" "card bg-base-100" "$home"

# A browser form POST sends `Accept: text/html`; without it SvelteKit replies
# with the JSON action result it uses for `use:enhance` fetches.
BROWSER=(-H "Origin: $ORIGIN" -H 'Accept: text/html,application/xhtml+xml')

echo "== POST / (valid student order, no-JS form post) =="
headers=$(curl -s -D - -o /dev/null -X POST "$ORIGIN/" "${BROWSER[@]}" \
  --data-urlencode 'out=yes' \
  --data-urlencode 'department=情報工学科' \
  --data-urlencode 'grade=4年' \
  --data-urlencode 'name=川名 健太' \
  --data-urlencode 'size-m=2' \
  --data-urlencode 'quest=再履修願' \
  --data-urlencode 'etc=' \
  --data-urlencode 'pay=cash')
check "redirects" "303" "$(printf '%s' "$headers" | head -1 | awk '{print $2}')"
location=$(printf '%s' "$headers" | grep -i '^location:' | tr -d '\r' | awk '{print $2}')
contains "redirect target is /pay/<token>" "/pay/" "$location"

echo "== GET $location =="
pay=$(curl -s "$ORIGIN$location")
contains "shows the confirmation heading" "支払い確認画面" "$pay"
contains "shows the M size row" "Mサイズ" "$pay"
code=$(printf '%s' "$pay" | grep -oE 'tracking-\[0.2em\][^>]*>[0-9]{4}<' | grep -oE '[0-9]{4}')
if [[ "$code" =~ ^[0-9]{4}$ ]]; then echo "  PASS  4-digit confirm code rendered ($code)"; else echo "  FAIL  no confirm code"; fail=1; fi

echo "== POST / (invalid: zero shirts) =="
bad=$(curl -s -X POST "$ORIGIN/" "${BROWSER[@]}" \
  --data-urlencode 'out=yes' --data-urlencode 'department=情報工学科' \
  --data-urlencode 'grade=4年' --data-urlencode 'name=川名 健太' --data-urlencode 'pay=cash')
contains "reports the empty-order error" "Tシャツを1枚以上ご指定ください。" "$bad"
contains "re-renders the form as HTML" "<!doctype html>" "$bad"

echo "== POST / (invalid: unknown department) =="
bad2=$(curl -s -X POST "$ORIGIN/" "${BROWSER[@]}" \
  --data-urlencode 'out=yes' --data-urlencode 'department=NOPE' \
  --data-urlencode 'grade=4年' --data-urlencode 'name=x' \
  --data-urlencode 'size-m=1' --data-urlencode 'pay=cash')
contains "reports the department error" "学科を選択してください。" "$bad2"

echo "== POST / (use:enhance JSON path) =="
json=$(curl -s -X POST "$ORIGIN/" -H "Origin: $ORIGIN" -H 'Accept: application/json' \
  --data-urlencode 'out=yes' --data-urlencode 'department=情報工学科' \
  --data-urlencode 'grade=4年' --data-urlencode 'name=川名 健太' \
  --data-urlencode 'size-m=1' --data-urlencode 'pay=cash')
contains "returns a redirect action result" '"type":"redirect"' "$json"
contains "with status 303" '"status":303' "$json"

echo "== unknown order =="
check "unknown token 404s" "404" "$(curl -s -o /dev/null -w '%{http_code}' "$ORIGIN/pay/definitelynotarealtoken")"
contains "renders the Japanese 404 message" "注文が見つかりませんでした。" "$(curl -s "$ORIGIN/pay/definitelynotarealtoken")"

echo "== CSRF =="
check "cross-origin POST is rejected" "403" "$(curl -s -o /dev/null -w '%{http_code}' -X POST "$ORIGIN/" \
  -H 'Origin: https://evil.example' --data-urlencode 'out=yes')"

echo
[ $fail -eq 0 ] && echo "ALL SMOKE TESTS PASSED" || echo "SOME SMOKE TESTS FAILED"
exit $fail
