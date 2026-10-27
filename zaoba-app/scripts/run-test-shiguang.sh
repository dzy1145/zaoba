#!/usr/bin/env bash
# 拾光导入映射层回归：把 src 里的模块复制成 .mjs 给 Node 跑，跑完清理。
# 用法：bash scripts/run-test-shiguang.sh
set -e
cd "$(dirname "$0")/.."

cleanup() {
  rm -f scripts/_shiguangImport.mjs scripts/_schedule.mjs scripts/_database.mjs
}
trap cleanup EXIT

cp src/services/database.js scripts/_database.mjs
cp src/utils/schedule.js scripts/_schedule.mjs
sed -e "s#'../utils/schedule.js'#'./_schedule.mjs'#" \
    -e "s#'./database.js'#'./_database.mjs'#" \
    src/services/shiguangImport.js > scripts/_shiguangImport.mjs

node scripts/test-shiguang-import.mjs "$@"
