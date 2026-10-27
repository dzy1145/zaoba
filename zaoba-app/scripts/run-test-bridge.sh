#!/usr/bin/env bash
# 跑 WebView 注入脚本的回归：把 src 里的宿主模块复制成 .mjs 给 Node 用，跑完清理。
set -e
cd "$(dirname "$0")/.."

cp src/services/importWebview.js scripts/_importWebview.mjs

node scripts/test-shiguang-bridge.mjs "$@"
status=$?
rm -f scripts/_importWebview.mjs
exit $status
