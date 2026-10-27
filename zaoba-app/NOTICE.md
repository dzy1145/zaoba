# 第三方开源声明（NOTICE）

早八的「教务导入」复用了开源项目「拾光课程表」的适配体系。相关版权归原作者所有，
以下列出用到的部分与许可。

## 1. 拾光课程表 shiguangschedule

- 仓库：<https://github.com/ShiGuangSchedule/shiguangschedule>
- 版权：Copyright (C) 2025 XingHeYuZhuan
- 许可：Apache License 2.0（全文见 [licenses/Apache-2.0.txt](licenses/Apache-2.0.txt)）

用到的是**通信协议**，不是整份代码：

- 教务导入页在 WebView 里注入适配脚本，脚本通过 `window.shiguangBridgePromise`
  回传数据（`saveImportedCourses` / `savePresetTimeSlots` / `saveCourseConfig` /
  `saveComboSchedule` / `showAlert` / `showPrompt` / `showSingleSelection`），
  通过 `window.shiguangBridge` 做提示与收尾（`showToast` / `notifyTaskCompletion`）。
- 原生侧通过 `window._shiguangNativeCallback(callbackId, isSuccess, result)` 回 promise。

早八的实现见 `src/services/importWebview.js`：桥的 JS 端语义与原实现一致，
但传输层换成了「自定义 scheme + `overrideUrlLoading` 拦截（JS→原生）」+
「`evalJS`（原生→JS）」，因为早八是 uni-app，没有原生注入层。
文件内的 `BRIDGE_JS` 常量即据此重写。

## 2. 拾光适配仓库 shiguang_warehouse

- 仓库：<https://github.com/ShiGuangSchedule/shiguang_warehouse>
- 版权：Copyright (c) 2025 星河欲转
- 许可：MIT License（全文见 [licenses/MIT-shiguang_warehouse.txt](licenses/MIT-shiguang_warehouse.txt)）

用到的部分：

- **学校索引数据**（学校名、教务系统登录地址、适配器元信息）编译进
  `src/data/schoolIndex.js`，由 `scripts/build-school-index.mjs` 从上游镜像生成。
- **各校适配脚本**（`resources/<校>/<脚本>.js`）不进仓库，运行时按需从镜像拉取并缓存
  （见 `src/services/adapterSource.js`），镜像顺序：Gitee → jsDelivr → GitHub raw。

## 说明

- 适配脚本是社区志愿者针对各校教务系统的适配成果，出问题请优先向上游仓库反馈；
  早八这边只负责承载与数据转换。
- 早八自己的代码许可见仓库根目录说明；本文件只声明第三方内容。
