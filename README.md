<div align="center">

# 🎮 GameHub 游戏商城

**基于 Vue 3 + Vite 打造的现代化游戏商城单页应用**

集游戏浏览、分类筛选、特惠榜单、玩家社区、个人中心于一体，覆盖一、二、三级完整页面结构。

[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.14-409eff?logo=element&logoColor=white)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-3.x-ffd859?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-5.x-42b883?logo=vue.js&logoColor=white)](https://router.vuejs.org/)

### 🔗 [👉 点击查看在线预览 Live Demo](https://southernraft.github.io/Vue-threeitem3/)

</div>

---

## ✨ 项目亮点

- 🏬 **完整商城形态** —— 11 个页面，一级（首页）→ 二级（栏目）→ 三级（详情）层层下钻
- 🗂️ **Pinia 全局状态** —— 收藏、购物车跨页面实时同步
- 🔌 **数据驱动** —— axios + json-server 模拟真实后端接口，前后端分离
- 🎨 **Element Plus** —— 40+ UI 组件，轮播 / 表格 / 表单 / 进度环 / 面包屑一应俱全
- 🚀 **自动化部署** —— 推送即构建，GitHub Actions 一键发布到 Pages
- 🧩 **生产自适应** —— 线上无需后端，自动读取打包数据，纯静态也能跑

---

## 🛠️ 技术栈

| 分类 | 技术 | 说明 |
|---|---|---|
| 核心框架 | **Vue 3** | Composition API / `<script setup>` |
| 路由 | **Vue Router** | 动态参数、懒加载、404 通配 |
| 状态管理 | **Pinia** | 收藏 / 购物车全局状态 |
| UI 组件 | **Element Plus** | 桌面端组件库 + 图标 |
| 数据请求 | **axios + json-server** | RESTful 接口模拟 |
| 构建工具 | **Vite** | 极速冷启动与热更新 |

---

## 📑 功能页面

| 页面 | 路径 | 层级 | 说明 |
|---|---|:---:|---|
| 🏠 首页 | `/` | 一级 | 轮播图、精选游戏、商店公告、热门排行 |
| 🎯 游戏库 | `/store` | 二级 | 游戏列表与多条件筛选 |
| 🔥 特惠榜 | `/deals` | 二级 | 折扣游戏与优惠券 |
| 💬 玩家社区 | `/community` | 二级 | 社区帖子与资讯 |
| 🗂️ 分类页 | `/category/:type` | 二级 | 按分类筛选（带 params 参数） |
| 👤 个人中心 | `/profile` | 二级 | 用户资料、偏好设置表单、订单、收藏表格 |
| 🎮 游戏详情 | `/game/:id` | 三级 | 详情、截图预览、玩家评价、评分仪表盘 |
| 📰 新闻详情 | `/news/:id` | 三级 | 公告资讯详情 |
| 🧾 订单详情 | `/order/:id` | 三级 | 订单信息详情 |
| 🔍 搜索 | `/search` | —— | 按关键词搜索（带 query 参数） |
| 🚫 404 | `/:pathMatch(.*)*` | —— | 未匹配路径兜底 |

---

## 📂 目录结构

```
item1/
├─ public/                  # 静态资源
├─ game.json                # 全部模拟数据（json-server 数据源）
├─ src/
│  ├─ api.js                # 数据请求层（开发走 json-server，生产读 game.json）
│  ├─ App.vue               # 根组件
│  ├─ main.js               # 入口（注册 Pinia / Router / Element Plus）
│  ├─ components/           # 公共组件
│  │  └─ Topnav.vue         # 顶部导航栏
│  ├─ views/                # 页面组件（11 个）
│  ├─ router/               # 路由配置
│  │  └─ index.js
│  └─ stores/               # Pinia 状态
│     └─ counter.js         # 游戏商店全局状态
└─ .github/workflows/       # GitHub Actions 自动部署
   └─ deploy.yml
```

---

## 🚀 快速开始

**1. 安装依赖**

```sh
npm install
```

**2. 启动数据接口**（json-server，端口 3003）

```sh
npm run server
```

**3. 启动开发服务器**

```sh
npm run dev
```

浏览器打开终端提示的地址即可访问。

**打包构建**

```sh
npm run build
```

---

## 🌐 部署说明

项目已接入 **GitHub Pages** 自动化部署：

- 推送到 `main` 分支后，GitHub Actions 自动构建并发布
- 生产环境下，`src/api.js` 会自动切换为读取打包进来的 `game.json`，**线上无需运行 json-server**
- 路由采用 hash 模式，静态托管下刷新子页面不会 404

> 在线预览：**https://southernraft.github.io/Vue-threeitem3/**

---

<div align="center">

Made with ❤️ &nbsp;|&nbsp; Powered by Vue 3 + Vite

</div>
