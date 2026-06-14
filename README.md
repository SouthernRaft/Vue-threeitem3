# GameHub 游戏商城

基于 Vue 3 + Vite 构建的游戏商城单页应用，包含首页、游戏库、特惠榜、玩家社区、个人中心、游戏详情等多级页面，覆盖一级、二级、三级页面结构。

## 技术栈

- **Vue 3**（Composition API / `<script setup>`）
- **Vue Router** —— 路由管理（含动态参数、懒加载、404）
- **Pinia** —— 全局状态管理（收藏、购物车）
- **Element Plus** —— UI 组件库
- **axios + json-server** —— 数据接口
- **Vite** —— 构建工具

## 功能页面

| 页面 | 路径 | 说明 |
|---|---|---|
| 首页 | `/` | 轮播图、精选游戏、商店公告、热门排行 |
| 游戏库 | `/store` | 游戏列表与筛选 |
| 特惠榜 | `/deals` | 折扣游戏与优惠券 |
| 玩家社区 | `/community` | 社区帖子与资讯 |
| 个人中心 | `/profile` | 用户资料、偏好设置表单、订单、收藏 |
| 分类页 | `/category/:type` | 按分类筛选游戏 |
| 游戏详情 | `/game/:id` | 详情、截图、评价、评分 |
| 搜索 | `/search` | 按关键词搜索游戏 |
| 404 | `/:pathMatch(.*)*` | 未匹配路径 |

## 项目运行

安装依赖：

```sh
npm install
```

启动数据接口（json-server，端口 3003）：

```sh
npm run server
```

启动开发服务器：

```sh
npm run dev
```

打包构建：

```sh
npm run build
```

## 部署说明

项目支持部署到 GitHub Pages。生产环境下数据请求层会自动改为读取打包进来的 `game.json`，无需运行 json-server。推送到 `main` 分支后，GitHub Actions 会自动构建并发布。
