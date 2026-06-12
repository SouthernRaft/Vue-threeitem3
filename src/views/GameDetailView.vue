<template>
  <main class="page" v-if="game">
    <!-- 游戏详情头部 -->
    <section class="detail-hero panel">
      <img :src="game.banner" :alt="game.name" class="detail-banner">
      <div class="detail-mask"></div>
      <div class="detail-content">
        <img :src="game.cover" :alt="game.name" class="detail-cover">
        <div class="detail-info">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/store' }">游戏库</el-breadcrumb-item>
            <el-breadcrumb-item>{{ game.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h1>{{ game.name }}</h1>
          <p>{{ game.description }}</p>
          <div class="detail-tags">
            <el-tag v-for="tag in game.tags" :key="tag" effect="dark">{{ tag }}</el-tag>
          </div>
          <div class="buy-row">
            <strong>{{ game.price === 0 ? '免费游玩' : '¥' + game.price }}</strong>
            <el-button type="primary" size="large" @click="addCart">加入愿望单</el-button>
            <el-button size="large" plain @click="toggleFavorite">收藏</el-button>
          </div>
        </div>
      </div>
    </section>

    <section class="detail-grid">
      <div>
        <!-- 游戏截图 -->
        <section class="media-card panel">
          <h2>游戏截图</h2>
          <el-image :src="game.screenshot" :preview-src-list="[game.screenshot, game.banner]" fit="cover" />
          <p>{{ game.summary }}</p>
        </section>

        <!-- 玩家评价 -->
        <section class="review-card panel">
          <h2>玩家评价</h2>
          <el-empty v-if="reviews.length === 0" description="暂无评价" />
          <div v-for="item in reviews" :key="item.id" class="review-item">
            <div>
              <strong>{{ item.user }}</strong>
              <span>{{ item.date }}</span>
            </div>
            <el-rate v-model="item.score" disabled />
            <p>{{ item.content }}</p>
          </div>
        </section>
      </div>

      <aside>
        <!-- 游戏信息 -->
        <el-card class="meta-card">
          <template #header>
            <strong>游戏信息</strong>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="类型">{{ game.categoryName }}</el-descriptions-item>
            <el-descriptions-item label="平台">{{ game.platform }}</el-descriptions-item>
            <el-descriptions-item label="开发商">{{ game.developer }}</el-descriptions-item>
            <el-descriptions-item label="发行商">{{ game.publisher }}</el-descriptions-item>
            <el-descriptions-item label="发行日期">{{ game.releaseDate }}</el-descriptions-item>
            <el-descriptions-item label="配置要求">{{ game.requirements }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 评分仪表盘 -->
        <el-card class="meta-card">
          <template #header>
            <strong>评分</strong>
          </template>
          <el-progress type="dashboard" :percentage="scorePercent" :color="progressColors">
            <template #default>
              <span class="score-text">{{ game.score }}</span>
            </template>
          </el-progress>
          <p class="muted">{{ game.players }} 名玩家关注</p>
        </el-card>
      </aside>
    </section>
  </main>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../stores/counter'

const API = 'http://localhost:3003'
const route = useRoute()
const gameStore = useGameStore()
const game = ref(null)
const reviews = ref([])

// 评分转换为百分比（10分制 → 百分制）
const scorePercent = computed(() => (game.value ? game.value.score * 10 : 0))
const progressColors = [
  { color: '#ff6b6b', percentage: 60 },
  { color: '#ffb34d', percentage: 80 },
  { color: '#20d6b5', percentage: 100 },
]

function addCart() {
  gameStore.addCart(game.value.id)
  ElMessage.success('已加入愿望单')
}

function toggleFavorite() {
  gameStore.toggleFavorite(game.value.id)
  ElMessage.success('收藏状态已更新')
}

// 从路由参数获取游戏ID，请求游戏详情和评价
onMounted(() => {
  const id = route.params.id
  axios.get(`${API}/games/${id}`).then((res) => {
    game.value = res.data
  })
  axios.get(`${API}/reviews?gameId=${id}`).then((res) => {
    reviews.value = res.data
  })
})
</script>

<style scoped>
.detail-hero {
  position: relative;
  height: 430px;
  overflow: hidden;
}

.detail-banner {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.56;
}

.detail-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(13, 15, 20, 0.95), rgba(13, 15, 20, 0.44), rgba(13, 15, 20, 0.86));
}

.detail-content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 30px;
  padding: 34px;
}

.detail-cover {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-info {
  width: 680px;
  padding-top: 14px;
}

.detail-info h1 {
  margin: 22px 0 12px;
  font-size: 42px;
  font-weight: 900;
}

.detail-info p {
  color: #d8e0eb;
  font-size: 17px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  margin: 22px 0;
}

.buy-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.buy-row strong {
  margin-right: 12px;
  color: var(--warning);
  font-size: 30px;
  font-weight: 900;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 18px;
  margin-top: 18px;
}

.media-card,
.review-card {
  padding: 20px;
  margin-bottom: 18px;
}

.media-card h2,
.review-card h2 {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 800;
}

.media-card .el-image {
  width: 100%;
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
}

.media-card p {
  margin: 16px 0 0;
  color: var(--text-second);
}

.review-item {
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.review-item div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-item strong {
  font-weight: 800;
}

.review-item span,
.review-item p {
  color: var(--text-second);
}

.meta-card {
  margin-bottom: 18px;
}

.score-text {
  color: var(--brand);
  font-size: 28px;
  font-weight: 900;
}
</style>
