#!/usr/bin/env bash
# 跑 xls 导入回归：把 src 里的模块复制成 .mjs 给 Node 用，跑完清理。
set -e
cd "$(dirname "$0")/.."

cp src/utils/xls.js scripts/_xls.mjs
cp src/utils/schedule.js scripts/_schedule.mjs
cp src/services/database.js scripts/_database.mjs
sed -e "s#'./schedule.js'#'./_schedule.mjs'#" \
    -e "s#'../services/database.js'#'./_database.mjs'#" \
    src/utils/xlsTimetable.js > scripts/_xlsTimetable.mjs

node scripts/test-xls.mjs "$@"
status=$?
rm -f scripts/_xls.mjs scripts/_schedule.mjs scripts/_database.mjs scripts/_xlsTimetable.mjs
exit $status
