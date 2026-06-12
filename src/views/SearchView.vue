<template>
  <main class="page">
    <div class="page-title">
      <div>
        <h1>搜索结果</h1>
        <p>使用 query 参数 keyword 搜索游戏名称和标签。</p>
      </div>
      <el-input v-model="keyword" class="search-input" placeholder="输入关键词">
        <template #append>
          <el-button :icon="Search" @click="doSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 空状态提示 -->
    <el-empty v-if="resultGames.length === 0" description="没有找到对应游戏" />

    <section class="search-list" v-else>
      <router-link
        v-for="game in resultGames"
        :key="game.id"
        class="search-item panel"
        :to="{ name: 'gameDetail', params: { id: game.id } }"
      >
        <img :src="game.cover" :alt="game.name">
        <div>
          <h3>{{ game.name }}</h3>
          <p>{{ game.description }}</p>
          <el-tag v-for="tag in game.tags" :key="tag" size="small">{{ tag }}</el-tag>
        </div>
        <strong>{{ game.price === 0 ? '免费' : '¥' + game.price }}</strong>
      </router-link>
    </section>
  </main>
</template>

<script setup>
import axios from '@/api'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const API = 'http://localhost:3003'
const route = useRoute() // 获取当前路由信息（只读）
const router = useRouter() // 获取路由实例（用于导航）
const keyword = ref(route.query.keyword || '') // 从URL获取初始关键词
const games = ref([])

// 搜索结果：根据关键词过滤游戏名称和标签
const resultGames = computed(() => {
  if (!keyword.value) return games.value
  return games.value.filter((game) => {
    // includes检查字符串是否包含子串，some检查数组是否有元素满足条件
    return game.name.includes(keyword.value) || game.tags.some((tag) => tag.includes(keyword.value))
  })
})

// 更新URL的query参数触发搜索
function doSearch() {
  router.push({ name: 'search', query: { keyword: keyword.value } })
}

// watch监听路由变化，同步更新keyword（支持浏览器前进/后退）
watch(
  () => route.query.keyword,
  (value) => {
    keyword.value = value || ''
  },
)

onMounted(() => {
  axios.get(`${API}/games`).then((res) => {
    games.value = res.data
  })
})
</script>

<style scoped>
.search-input {
  width: 360px;
}

.search-list {
  display: grid;
  gap: 14px;
}

.search-item {
  display: grid;
  grid-template-columns: 100px 1fr 90px;
  gap: 18px;
  align-items: center;
  padding: 14px;
}

.search-item img {
  width: 100px;
  height: 124px;
  object-fit: cover;
  border-radius: 6px;
}

.search-item h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
}

.search-item p {
  margin: 0 0 10px;
  color: var(--text-second);
}

.search-item .el-tag {
  margin-right: 6px;
}

.search-item strong {
  color: var(--warning);
  font-size: 20px;
  font-weight: 900;
  text-align: right;
}
</style>
