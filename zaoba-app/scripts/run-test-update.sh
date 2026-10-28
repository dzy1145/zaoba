#!/usr/bin/env bash
# 跑更新模块的回归：把 updater.js 复制成 .mjs 给 Node 用，跑完清理。
set -e
cd "$(dirname "$0")/.."

cp src/services/updater.js scripts/_updater.mjs

node scripts/test-update.mjs "$@"
status=$?
rm -f scripts/_updater.mjs
exit $status
