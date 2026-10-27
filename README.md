# 早八 · 离线课表（Android）

把微信小程序「丸辣明天又是早八」的个人课表搬成一个**纯本地**的安卓 App：
所有数据都存在手机 SQLite 里，没有账号、没有云端、不联网。

原版的「共享课表」依赖云开发，APK 里没有这个能力，所以数据搬运改成
**导出/导入 JSON**；另外支持把教务系统导出的 **Excel 97-2003 (.xls) 课表**
直接解析、转换后导入，以及**登录教务系统自动抓取课表**（复用开源项目
[拾光课程表](https://github.com/ShiGuangSchedule/shiguangschedule) 的 269 校适配库）。

## 功能

- **周课表**：按周次过滤渲染（单双周 / 起止日期）、点空格建课、点卡片编辑、
  长按拖动复制 / 移动、拖到顶部删除、当前时间线、今天列高亮
- **多学期**：新建 / 切换 / 删除；开学日期支持「按当前周次」「按开学日期」两种录入
- **节次表**：自定义每节起止时间，改动即时落库（没有保存按钮）
- **外观**：浅色 / 深色 / 跟随系统 + 4 种强调色，导航栏、状态栏、TabBar 同步
- **数据**：导出 JSON 到剪贴板 / 从剪贴板导入（覆盖、追加）；导入教务 `.xls`
- **教务导入**：内置 269 所学校 / 298 个适配器索引，选学校 → App 内 WebView 登录教务 →
  适配脚本抓取课表并转换成早八课程（适配脚本运行时从社区镜像拉取并缓存）

## 技术栈

uni-app（Vue 3 + Vite）+ 原生 SQLite（`plus.sqlite`），H5 端自动退化成 localStorage，
所以同一套数据层逻辑能直接在 Node / 浏览器里跑回归测试。

## 构建

```bash
npm install --registry https://registry.npmmirror.com
npm run build:app          # 产物：dist/build/app
```

云打包 APK（HBuilderX CLI，`androidpacktype 3` = 云端证书）：

```bash
cli pack --project <项目目录> --platform android \
  --android.packagename com.daidi.zaoba --android.androidpacktype 3
```

## 目录

| 路径 | 说明 |
|---|---|
| `zaoba-app/src/pages/index/index.vue` | 课表页：网格、周导航、拖动、建/改课弹窗 |
| `zaoba-app/src/pages/mine/mine.vue` | 我的页：昵称、学期管理、外观、导入导出 |
| `zaoba-app/src/pages/periods/periods.vue` | 节次表 |
| `zaoba-app/src/services/database.js` | SQLite / localStorage 双态数据层，含导入导出与「当前学期」 |
| `zaoba-app/src/utils/schedule.js` | 日期 ↔ 周次换算、`hitDate` 判断某天是否上课 |
| `zaoba-app/src/utils/xls.js`、`xlsTimetable.js` | 教务 `.xls` 解析 → 早八 JSON |
| `zaoba-app/src/pages/import/import.vue` | 教务导入：学校列表、选适配器、进度 |
| `zaoba-app/src/services/importWebview.js` | 教务导入的 WebView 宿主与 JS 桥（App 专用） |
| `zaoba-app/src/services/shiguangImport.js` | 拾光标准 JSON → 早八课表（周次拆段、幂等落库） |
| `zaoba-app/src/services/adapterSource.js` | 适配脚本按需拉取 + 缓存（Gitee → jsDelivr → GitHub raw） |
| `zaoba-app/src/data/schoolIndex.js` | 学校/适配器索引（`scripts/build-school-index.mjs` 生成） |
| `zaoba-app/scripts/` | xls 解析、拾光映射、注入脚本的回归脚本 |
| `早八-项目记忆.md` | 架构决定与踩过的坑（开发记录） |
| `图标设计/` | App 图标的设计源文件 |

## 导入导出 JSON

APK 和小程序共用一套 JSON，可以互相粘贴导入：

```json
{ "version": "1.0", "exportTime": 0, "app": "早八",
  "user": { "nickname": "", "periods": [{ "index":1, "start":"08:00", "end":"08:45" }],
            "themeMode": "auto", "accent": "blue", "rowH": 140, "dayW": 128 },
  "semesters": [{ "id":"", "name":"", "startDate":"", "createdAt":0, "sortOrder":0 }],
  "courses":   [{ "id":"", "semesterId":"", "name":"", "teacher":"", "location":"",
                  "day":0, "startPeriod":1, "endPeriod":2, "startDate":"", "endDate":null,
                  "weekType":"every", "needPc":false, "color":"#4F7CD4", "createdAt":0 }],
  "currentSemesterId": "" }
```

`day`：0=周一 … 6=周日；`weekType`：`every` / `everyOther`；
单双周与起止周都落在 `startDate` / `endDate` 上（日期制是唯一落库形态）。

## 说明

- 仓库只放源码和设计源文件：`node_modules/`、`dist/`、APK 产物不进仓库，APK 走 Release。
- `早八-项目记忆.md` 是开发过程记录，里面的本机路径、设备序列号、账号信息已脱敏。

## 致谢与许可

教务导入这一块复用开源项目「拾光课程表」的适配体系，版权归原作者：

- [ShiGuangSchedule/shiguangschedule](https://github.com/ShiGuangSchedule/shiguangschedule)（Apache-2.0）——
  课表导入的 JS 桥协议；
- [ShiGuangSchedule/shiguang_warehouse](https://github.com/ShiGuangSchedule/shiguang_warehouse)（MIT）——
  学校索引与各校适配脚本（脚本不进本仓库，运行时按需拉取）。

完整声明见 `zaoba-app/NOTICE.md`，许可全文在 `zaoba-app/licenses/` 下。