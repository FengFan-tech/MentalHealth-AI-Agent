# 心理健康 AI 助手 · MentalHealth-AI-Agent

基于 **Vue 3 + Vite** 构建的心理健康陪伴类 Web 应用。以「一次温暖的对话，化孤独为慰藉」为核心体验，提供 **AI 心理倾诉对话、情绪分析、情绪日记、心理知识库** 等能力，并配套完整的 **管理后台**（情感分析、结论分析、数据大屏、知识库管理）。

前端通过 SSE 实现 AI 回复的流式打字效果，配合 ECharts 情绪可视化仪表盘，为使用者提供低门槛、有温度的心理自助工具。

---

## ✨ 功能特性

### 用户端

| 模块 | 说明 |
| --- | --- |
| 首页 | 项目主视觉与情感化引导入口，一键进入倾诉或记录心情 |
| AI 心理倾诉（`/conclutions`） | 基于 SSE 流式输出的多轮 AI 对话，实时显示 AI 打字状态；支持会话列表、历史消息加载、输入长度校验；内置**风险等级提示**，对负面情绪与高风险会话给出温和提醒 |
| 情绪分析仪表盘 | 对话结束后展示 AI 情绪分析结论：情绪标签、情绪强度、风险等级、风险描述与建议 |
| 情绪日记（`/emotion-diary`） | 按日记录心情与事件，形成个人情绪轨迹 |
| 心理知识库（`/knowledges`） | 分类树导航 + 文章分页浏览，支持阅读详情与富文本内容渲染 |

### 管理端（`/back`）

| 模块 | 说明 |
| --- | --- |
| 情感分析 | 分页查询全部用户情绪日志，支持查看与删除 |
| 结论分析 | 分页查询咨询会话、查看会话消息详情与情绪分析结果、删除会话 |
| 数据大屏 | 基于 ECharts 的运营数据可视化总览 |
| 知识库管理 | 分类管理、文章增删改查、封面上传、文章上下架状态切换、富文本编辑 |

### 通用能力

- **JWT 鉴权**：`axios` 请求拦截器自动注入 `Authorization: Bearer <token>`，响应码 `-1` 时自动清理登录态并跳转登录页
- **路由守卫**：按 `userType` 区分角色 —— 普通用户（`1`）与管理员（`2`）互不越界访问
- **登录 / 注册**：表单校验、登录态持久化到 `localStorage`
- **富文本编辑器**：集成 wangEditor，支持图文混排文章发布
- **Markdown 渲染**：AI 回复支持 Markdown 展示
- **构建优化**：`manualChunks` 拆分 vendor 包（vue / element-plus / echarts / wangeditor），提升首屏加载

---

## 🛠 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建工具 | Vite |
| UI 组件库 | Element Plus + @element-plus/icons-vue |
| 状态管理 | Pinia |
| 路由 | Vue Router 4（Hash 模式，懒加载 + 组件缓存） |
| 网络请求 | Axios（自定义实例 + 请求/响应拦截器） |
| 流式通信 | @microsoft/fetch-event-source（SSE） |
| 数据可视化 | ECharts 5 |
| 富文本 | wangEditor 5 + @wangeditor/editor-for-vue |
| 样式 | SCSS / Sass |
| 工程化 | ESLint + Prettier |

---

## 📁 项目结构

```
AI-Agent/
├── public/                     # 静态资源（favicon、icons）
├── src/
│   ├── apis/                   # 接口层，按角色拆分
│   │   ├── admin/              #   管理端：情感分析、结论、大屏、知识库、登出
│   │   └── user/               #   用户端：会话、情绪日记、知识库、注册
│   ├── assets/                 # 图片资源（情绪图标、页面插画）
│   ├── components/             # 公共组件：布局、对话框、侧边栏、富文本、Markdown
│   ├── config/                 # 前台配置
│   ├── router/                 # 路由表与全局前置守卫
│   ├── stores/                 # Pinia 状态（登录用户信息）
│   ├── utils/sever.js          # Axios 实例与拦截器
│   ├── views/
│   │   ├── Home.vue            # 首页
│   │   ├── Login.vue           # 登录
│   │   ├── Register.vue        # 注册
│   │   ├── admin/              # 管理端页面
│   │   └── user/               # 用户端页面
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js              # 别名、开发代理、构建分包
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9（或 pnpm / yarn）

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 3. 生产构建，产物输出到 dist/
npm run build

# 4. 本地预览构建产物
npm run preview
```

### 后端接口配置

所有请求统一走 `/api` 前缀，开发环境由 Vite 代理转发到后端服务，配置见 `vite.config.js`：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://159.75.169.224:1235/api',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

> 如需连接自建后端，修改上述 `target` 为你的服务地址即可。生产部署时请在 Nginx 等网关层把 `/api` 反向代理到后端。

### 页面入口

| 路径 | 说明 |
| --- | --- |
| `/#/` | 用户端首页 |
| `/#/conclutions` | AI 心理倾诉对话 |
| `/#/emotion-diary` | 情绪日记 |
| `/#/knowledges` | 心理知识库 |
| `/#/auth/login` | 登录 |
| `/#/auth/register` | 注册 |
| `/#/back/dashbroad` | 管理端数据大屏（需管理员登录） |

---

## 🔐 角色说明

| `userType` | 角色 | 可访问范围 |
| --- | --- | --- |
| `1` | 普通用户 | 前台全部页面，访问后台或登录页会被重定向回首页 |
| `2` | 管理员 | 自动进入 `/back/emotion`，访问前台页面会被重定向回后台 |

未登录用户可浏览前台公开页面，访问 `/back/**` 会被拦截到登录页。

---

## 📌 说明

- 本项目为前端工程，需配合心理健康 AI 后端服务（会话、情绪分析、知识库、数据统计等接口）运行。
- AI 输出内容仅供情绪陪伴与自我觉察参考，**不能替代专业心理咨询与医疗诊断**。若你或身边的人正处于危机状态，请及时联系专业机构或当地心理援助热线。

---

## 📄 License

本项目仅用于学习与交流，如需商用请自行评估。
