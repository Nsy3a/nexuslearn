## 问题溯源（为什么）
- 为什么“看起来像空中楼阁”：多页面使用本地假数据，未接入后端接口（如 Community.vue 仅本地数组，缺少实际 API 调用）。
- 为什么“AI没有介入”：AI 仅在资料摄取与评估流程中被调用，其他模块缺少触达 AI 的工作流（如 AI 帮问未调用 /ai/decompose）。
- 为什么“交互不成闭环”：人与系统、系统与 AI 的双向数据流未贯通；偏好文档与历史交互未驱动搜索与学习（ContextEngine 未对接 /profile /history）。
- 为什么“接口配置混乱”：前端存在 8080 与 8081 的端口混用，未统一 API Base（stores/learning.ts 走 8081；Materials/Progress/Search 走 8080）。

## 改造目标与原则
- 目标：落实人与系统、系统与 AI 的三向循环，打通社区/仓库/经济生态闭合，真正“用起来”。
- 原则：
  - 5S（除旧迎新、统一规范、清扫重构、标准化、持续化）
  - Simple（优先复用现有接口和模块，先通后优）
  - Secure（所有输入校验与错误显性处理，不崩溃）
  - Supportable（结构化日志与可观察性，便于迭代）

## 体系架构总览（现状核对）
- 前端 API 入口：`src/utils/http.ts` 提供 `safeFetchJson` 与 `withParams`（nexuslearn-frontend/src/utils/http.ts:1-16）。
- 后端服务：`nexuslearn/backend/server.js`（默认 PORT=8081）。核心接口：
  - 学习闭环：`/goals`、`/plans`、`/progress/:userId`、`/assess`、`/learn/session/*`（server.js:163、175、201、210、220、242）
  - 资料仓库：`/ingest/url`、`/ingest/upload`、`/materials`、`/materials/:id?details=ai`（server.js:286、349、195、449）
  - 搜索融合：`/search`（server.js:503）
  - 偏好与历史：`/profile/:id` GET/PUT、`/history/:id`（server.js:477、485、496）
  - 社区生态：朋友圈 `/friends/*`、兴趣圈 `/circles/*`、话题圈 `/topics/*`（server.js:806、919、1078）
  - 经济治理：`/governance/*`、知识 NFT `/nfts`（server.js:768、756）
- AI 能力接入点：`aiProcessor.js` 模拟 OCR/翻译/审核/分类/知识图谱/去重（nexuslearn/backend/aiProcessor.js:1-281），已在 `/ingest/*` 与 `/materials/:id?details=ai` 中实际调用。

## 前端改造（统一API与落地交互）
1. 统一 API Base 与拦截器
- 在 `src/utils/http.ts` 增加 `API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'`，封装 `apiFetchJson(path, init, fallback)`，移除硬编码端口。
- 全项目替换 `http://localhost:8080|8081` 为 `API_BASE`，避免端口混乱。

2. 学习中心（Learning.vue + store）对接真实后端
- 已有 store 接口指向 8081：`createGoal`、`generatePlan`、`fetchProgress`、`assess`、`startSession`、`submitSession`、`fetchReinforcement`（nexuslearn-frontend/src/stores/learning.ts:27-85）。
- 页面补齐调用与状态呈现：提交评估后刷新掌握度、渲染 reinforcement 列表；保障错误提示不崩溃。

3. 上下文引擎（ContextEngine.vue）改为真实数据驱动
- 读取与保存偏好：`GET /profile/:id`、`PUT /profile/:id`（server.js:477、485）。
- 历史交互：`GET /history/:id` 展示 timeline（server.js:496）。
- 将当前的硬编码 `userProfile/interactionHistory` 改为 API 数据源，并让 avoidRules/prefs 驱动搜索与学习的 UI 文案。

4. AI 社区（Community.vue）对接后端生态
- 朋友圈：`/friends/add`、`/friends/:userId`、`/friends/posts`、评论与点赞（server.js:808、832、843、861）。
- 兴趣圈：`POST/GET /circles`、`/circles/:id/join`、`/circles/:id/posts`、`/circles/:id/proposals`（server.js:921、944、951、971、1013、1045）。
- 话题圈：`POST /topics`、`GET /topics`、`GET /topics/hot`、`POST /topics/:id/posts`、点赞/回复等（server.js:1080、1101、1112、1123、1174、1198）。
- 将 AI 建议与“智能问题生成”替换为：
  - 生成智能问题→调用 `/ai/decompose` 分解用户需求，落地为圈子任务或话题讨论（server.js:551）。

5. 搜索与仓库（AdvancedSearch.vue / Materials.vue）
- 搜索：统一走 `/search`，携带 `userId` 与 `filters`，由后端进行偏好匹配与避让（server.js:503）。
- 资料摄取：UI 按 `/ingest/url`、`/ingest/upload`、`/materials`、`/materials/:id?details=ai` 展示 AI 处理轨迹与质量评估（server.js:286、349、195、449）。

## 后端与 AI 能力接入（迭代深化）
1. AI 服务抽象层
- 将 `aiProcessor.js` 抽象为策略接口（ocr/translate/moderation/classify/graph/dedupe），预留对接真实 LLM/云服务的适配器；通过 `.env` 切换模拟/真实。
- 安全：后端不得日志输出密钥；所有外部 API 失败→显性错误返回。

2. 偏好驱动与闭环
- `/profile/:id` 与 `/history/:id` 的数据在 `/search` 与 `/plans`、`/learn/session` 中生效（已部分生效：搜索避让 avoidRules 与 prefs 影响 rank，见 server.js:511-525）。
- 在评估 `/assess` 与提交 `/learn/session/submit` 后，追加写入 `/history`，ContextEngine 即时可见（新增后端写入；设计预案）。

## 人 ↔ 系统 ↔ AI 三向闭环设计
- 人→系统：用户在学习/社区进行操作，系统记入 `/history` 与 `/profiles`。
- 系统→AI：摄取与生成流转至 AI（/ingest/**、/ai/**），返回结构化结果（质量分、图谱、建议）。
- AI→人：结果进入 UI（学习计划、评估反馈、知识图谱推荐），人基于建议继续交互；形成可视化进度与复盘。

## 社区 / 仓库 / 经济 的生态闭合
- 社区：朋友圈、兴趣圈、话题圈三层协作机制已具备接口；兴趣圈含治理参数与提案/投票（server.js:919-1076）。
- 仓库：摄取内容与 AI 处理入库，并可索引与检索（server.js:286-347、449-475、503，searchService 接入 ES）。
- 经济：付费需求→Escrow→验收→知识 NFT 铸造与共享（server.js:563-602、748-760）；治理 `/governance/*` 读取链上事件与发起/投票（server.js:768-797）。

## 安全与可观察性
- 输入校验：后端对参数进行类型与权限检查（现有基础校验，后续增强）。
- 错误显性：统一 `sendJson(400|500, { error })`；前端使用 `ElMessage` 友好提示。
- 指标采集：`/metrics` 已提供请求采样（server.js:1245），前端可加简易监控面板。

## 里程碑与验收
- 里程碑 1（统一 API 与接线）：完成 API Base 统一、ContextEngine/Community 接入真实数据，学习/搜索/摄取贯通；可视化展示 AI 处理轨迹。
- 里程碑 2（闭环增强）：将评估与提交写入 `/history`，AI 帮问对接 `/ai/decompose`，并能转为圈子任务/话题讨论。
- 里程碑 3（经济治理）：演示一条从付费需求→分包→社区协作→验收→知识 NFT 的完整链路；治理提案读取与投票可视化。
- 验收标准：
  - 用户从“创建目标→生成计划→开始会话→提交评估→查看强化计划”的学习闭环无错误；
  - 资料摄取全过程显示 AI 审核/翻译/分类/图谱/去重结果；
  - 社区的圈子与话题可创建/加入/发帖/点赞/回复，治理提案与投票可用；
  - 搜索结果受偏好与规避规则影响（避让与排序可见）。

---

请确认此改造计划，确认后我将按上述里程碑分步实施，先完成“统一 API 与接线”并交付可运行的端到端闭环。