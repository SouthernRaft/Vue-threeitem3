<template>
  <main class="home-page">
    <section class="hero">
      <el-carousel height="420px" indicator-position="outside">
        <el-carousel-item v-for="game in hotGames" :key="game.id">
          <div class="hero-slide">
            <img :src="game.banner" :alt="game.name" class="hero-bg">
            <div class="hero-content">
              <el-tag type="success" effect="dark">今日推荐</el-tag>
              <h1>{{ game.name }}</h1>
              <p>{{ game.summary }}</p>
              <div class="hero-tags">
                <el-tag v-for="tag in game.tags" :key="tag" effect="plain">{{ tag }}</el-tag>
              </div>
              <div class="hero-actions">
                <el-button type="primary" size="large" @click="goDetail(game.id)">查看详情</el-button>
                <el-button size="large" plain @click="addCart(game.id)">加入愿望单</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <section class="page home-section">
      <!-- 顶部数据指标：v-for 遍历 featureList，@click 触发 ElMessage 提示 -->
      <div class="stats-row">
        <div
          v-for="item in featureList"
          :key="item.title"
          class="feature-box panel"
          @click="showFeature(item)"
        >
          <!-- component :is 动态渲染 Element Plus 图标组件 -->
          <el-icon><component :is="item.icon" /></el-icon>
          <div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>

      <div class="section-title">
        <h2>精选游戏</h2>
        <RouterLink to="/store">查看全部</RouterLink>
      </div>
      <!-- 精选游戏卡片：slice(0, 8) 只取前 8 条 -->
      <div class="game-grid">
        <article v-for="game in games.slice(0, 8)" :key="game.id" class="game-card panel">
          <RouterLink :to="{ name: 'gameDetail', params: { id: game.id } }">
            <div class="cover-wrap">
              <img :src="game.cover" :alt="game.name" class="cover-img">
              <!-- 折扣标签 -->
              <span class="discount">{{ game.discount > 0 ? `-${game.discount}%` : '新品' }}</span>
            </div>
            <div class="game-card-body">
              <!-- 标题和收藏按钮 -->
              <div class="title-row">
                <h3>{{ game.name }}</h3>
                <button class="plain-heart" @click.stop="toggleFavorite(game)">收藏</button>
              </div>
              <p class="muted">{{ game.summary }}</p>
              <!-- el-rate 评分组件，10 分制只读展示 -->
              <div class="card-slot">
                <el-rate v-model="game.score" disabled :max="10" show-score score-template="{value}" />
              </div>
              <div class="card-footer">
                <span class="price">{{ game.price === 0 ? '免费游玩' : `¥${game.price}` }}</span>
                <span class="muted">{{ game.categoryName }}</span>
              </div>
            </div>
          </RouterLink>
        </article>
      </div>

      <div class="home-columns">
        <!-- 左栏：商店公告，news.slice(0, 5) 取前 5 条 -->
        <div class="panel news-panel">
          <div class="section-title small">
            <h2>商店公告</h2>
            <el-button text type="primary" @click="$router.push('/community')">去社区</el-button>
          </div>
          <RouterLink
            v-for="item in news.slice(0, 5)"
            :key="item.id"
            class="news-item"
            :to="{ name: 'newsDetail', params: { id: item.id } }"
          >
            <el-tag size="small">{{ item.type }}</el-tag>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.summary }}</p>
            </div>
            <span>{{ item.date }}</span>
          </RouterLink>
        </div>

        <!-- 右栏：热门排行，rankGames 是按 players 排序的 computed -->
        <div class="panel rank-panel">
          <div class="section-title small">
            <h2>热门排行</h2>
            <span class="muted">按玩家数排序</span>
          </div>
          <RouterLink
            v-for="(game, index) in rankGames"
            :key="game.id"
            class="rank-item"
            :to="{ name: 'gameDetail', params: { id: game.id } }"
          >
            <b>{{ index + 1 }}</b>
            <img :src="game.cover" :alt="game.name">
            <div>
              <strong>{{ game.name }}</strong>
              <p>{{ game.players }} 名玩家关注</p>
            </div>
            <span>{{ game.score }}</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<!-- 首页视图 - 展示轮播图、精选游戏、商店公告和热门排行 -->
<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../stores/counter'

// json-server API地址
const API = 'http://localhost:3003'
const router = useRouter()
const gameStore = useGameStore()
// 游戏列表数据
const games = ref([])
// 新闻公告数据
const news = ref([])

// 首页顶部 4 个指标卡的静态数据，icon 对应 Element Plus 图标名
const featureList = [
  { title: '12 款游戏', text: '全部来自 game.json', icon: 'Collection' },
  { title: '10 条公告', text: '新闻详情可跳转', icon: 'Bell' },
  { title: '15+ UI 组件', text: '使用 Element Plus', icon: 'Tools' },
  { title: 'Pinia 状态', text: '收藏与购物车', icon: 'Star' },
]

// 轮播图数据：computed 筛出评分 >= 9 的高分游戏，最多 3 个
const hotGames = computed(() => games.value.filter((game) => game.score >= 9).slice(0, 3))
// 热门排行：复制数组后按 players 降序排，取前 6 个（用扩展运算符避免改动原数组）
const rankGames = computed(() => [...games.value].sort((a, b) => b.players - a.players).slice(0, 6))

/**
 * 跳转到游戏详情页
 */
function goDetail(id) {
  router.push({ name: 'gameDetail', params: { id } })
}

/**
 * 添加游戏到愿望单（购物车）
 */
function addCart(id) {
  gameStore.addCart(id)
  ElMessage.success('已加入愿望单')
}

/**
 * 收藏/取消收藏，状态存在 Pinia 的 gameStore 里
 */
function toggleFavorite(game) {
  gameStore.toggleFavorite(game.id)
  ElMessage.success(`已更新 ${game.name} 的收藏状态`)
}

/**
 * 点击特性卡片时显示提示信息
 */
function showFeature(item) {
  ElMessage.info(item.text)
}

// 组件挂载后用 axios 请求 json-server 的游戏和公告数据
onMounted(() => {
  axios.get(`${API}/games`).then((res) => {
    games.value = res.data
  })
  axios.get(`${API}/news`).then((res) => {
    news.value = res.data
  })
})
</script>

<style scoped>
.hero {
  width: 1180px;
  margin: 26px auto 0;
}

.hero-slide {
  position: relative;
  height: 420px;
  overflow: hidden;
  border-radius: 8px;
  background: #161b22;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.58;
}

.hero-slide::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(10, 12, 16, 0.92), rgba(10, 12, 16, 0.34), rgba(10, 12, 16, 0.72));
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 520px;
  padding: 62px 0 0 58px;
}

.hero-content h1 {
  margin: 18px 0 12px;
  font-size: 46px;
  font-weight: 900;
}

.hero-content p {
  color: #d6dee8;
  font-size: 18px;
}

.hero-tags {
  display: flex;
  gap: 8px;
  margin: 20px 0 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.home-section {
  padding-top: 22px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 34px;
}

.feature-box {
  min-height: 92px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.feature-box .el-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  color: #101114;
  background: var(--brand);
}

.feature-box strong,
.feature-box span {
  display: block;
}

.feature-box strong {
  font-size: 18px;
  font-weight: 800;
}

.feature-box span {
  color: var(--text-second);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 18px;
}

.section-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.section-title a {
  color: var(--brand);
}

.section-title.small {
  margin-bottom: 8px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.game-card {
  position: relative;
  overflow: hidden;
}

.cover-wrap {
  position: relative;
  height: 235px;
}

.discount {
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--brand);
  color: #101114;
  font-weight: 800;
}

.game-card-body {
  padding: 14px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  min-height: 26px;
}

.game-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.game-card p {
  height: 48px;
  margin: 0 0 12px;
  overflow: hidden;
}

.card-slot {
  height: 30px;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.plain-heart {
  padding: 2px 8px;
  border: 0;
  border-radius: 4px;
  color: var(--brand);
  background: rgba(32, 214, 181, 0.14);
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: 0.2s;
}

.plain-heart:hover {
  background: rgba(32, 214, 181, 0.28);
  transform: scale(1.05);
}

.home-columns {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  margin-top: 34px;
}

.news-panel,
.rank-panel {
  padding: 18px;
}

.news-item,
.rank-item {
  display: grid;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.news-item {
  grid-template-columns: 62px 1fr 100px;
}

.news-item strong,
.rank-item strong {
  font-weight: 800;
}

.news-item p,
.rank-item p {
  margin: 3px 0 0;
  color: var(--text-second);
}

.rank-item {
  grid-template-columns: 28px 54px 1fr 42px;
}

.rank-item b {
  color: var(--brand);
  font-size: 20px;
}

.rank-item img {
  width: 54px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}

.rank-item span {
  color: var(--warning);
  font-weight: 800;
}
</style>
