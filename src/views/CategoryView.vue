<template>
  <main class="page">
    <div class="page-title">
      <div>
        <h1>{{ categoryName || '分类游戏' }}</h1>
        <p>参数路由：/category/{{ route.params.type }}，当前列表从 games 数据中过滤得到。</p>
      </div>
      <el-button type="primary" @click="$router.push('/store')">返回游戏库</el-button>
    </div>

    <!-- 分类统计 -->
    <div class="category-summary panel">
      <el-statistic title="分类游戏数" :value="categoryGames.length" />
      <el-statistic title="平均评分" :value="averageScore" />
      <el-statistic title="最高折扣" :value="maxDiscount">
        <template #suffix>%</template>
      </el-statistic>
    </div>

    <!-- 游戏列表 -->
    <section class="category-grid">
      <article v-for="game in categoryGames" :key="game.id" class="category-card panel">
        <router-link :to="{ name: 'gameDetail', params: { id: game.id } }">
          <img :src="game.cover" :alt="game.name" class="cover-img">
          <div>
            <h3>{{ game.name }}</h3>
            <p>{{ game.summary }}</p>
            <el-tag v-for="tag in game.tags" :key="tag" size="small">{{ tag }}</el-tag>
            <strong>{{ game.price === 0 ? '免费' : '¥' + game.price }}</strong>
          </div>
        </router-link>
      </article>
    </section>
  </main>
</template>

<script setup>
import axios from '@/api'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const API = 'http://localhost:3003'
const route = useRoute()
const games = ref([])
const categories = ref([])

// 根据路由参数type过滤当前分类的游戏
const categoryGames = computed(() => games.value.filter((game) => game.category === route.params.type))
const categoryName = computed(() => {
  const item = categories.value.find((category) => category.type === route.params.type)
  return item ? item.name : ''
})
const averageScore = computed(() => {
  if (categoryGames.value.length === 0) return 0
  const total = categoryGames.value.reduce((sum, game) => sum + game.score, 0)
  return Number((total / categoryGames.value.length).toFixed(1))
})
const maxDiscount = computed(() => Math.max(0, ...categoryGames.value.map((game) => game.discount)))

onMounted(() => {
  axios.get(`${API}/games`).then((res) => {
    games.value = res.data
  })
  axios.get(`${API}/categories`).then((res) => {
    categories.value = res.data
  })
})
</script>

<style scoped>
.category-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 20px;
  margin-bottom: 20px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.category-card {
  overflow: hidden;
}

.category-card img {
  height: 230px;
}

.category-card div {
  padding: 14px;
}

.category-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
}

.category-card p {
  height: 46px;
  margin: 0 0 10px;
  color: var(--text-second);
  overflow: hidden;
}

.category-card .el-tag {
  margin-right: 6px;
}

.category-card strong {
  display: block;
  margin-top: 12px;
  color: var(--warning);
  font-size: 18px;
  font-weight: 900;
}
</style>
