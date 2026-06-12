<template>
  <main class="page">
    <div class="page-title">
      <div>
        <h1>游戏库</h1>
        <p>列表页展示来自 game.json 的游戏数据，可以筛选、排序并跳转到详情页。</p>
      </div>
      <el-button type="primary" :icon="Refresh" @click="resetFilter">重置筛选</el-button>
    </div>

    <div class="store-layout">
      <!-- 左侧筛选面板：分类导航 + 价格滑块 -->
      <aside class="filter-panel panel">
        <h2>分类导航</h2>
        <!-- 遍历分类，点击跳到 category 路由（按 type 区分分类） -->
        <RouterLink
          v-for="item in categories"
          :key="item.id"
          :to="{ name: 'category', params: { type: item.type } }"
          class="category-link"
        >
          <span>{{ item.name }}</span>
          <el-tag :type="item.color" size="small">{{ item.count }}</el-tag>
        </RouterLink>
        <div class="price-filter">
          <p>最高价格：¥{{ filter.maxPrice }}</p>
          <!-- 滑块拖动时直接更新 filter.maxPrice，computed 会自动重新筛选 -->
          <el-slider v-model="filter.maxPrice" :min="0" :max="200" />
        </div>
      </aside>

      <section>
        <div class="panel result-tools">
          <el-input v-model="filter.keyword" placeholder="输入游戏名称" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="filter.category" placeholder="选择分类" clearable>
            <el-option
              v-for="item in categories"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
          <el-select v-model="filter.sort" placeholder="排序方式">
            <el-option label="评分最高" value="score" />
            <el-option label="价格最低" value="price" />
            <el-option label="玩家最多" value="players" />
          </el-select>
          <el-switch v-model="filter.freeOnly" active-text="只看免费" />
        </div>

        <!-- el-tabs 切换卡片视图 / 表格视图，v-model 绑定当前视图 -->
        <el-tabs v-model="viewMode" class="store-tabs">
          <el-tab-pane label="卡片视图" name="card">
            <!-- 卡片视图：遍历分页后的 pagedGames -->
            <div class="store-grid">
              <article v-for="game in pagedGames" :key="game.id" class="store-card panel">
                <RouterLink :to="{ name: 'gameDetail', params: { id: game.id } }">
                  <img :src="game.cover" :alt="game.name" class="cover-img">
                </RouterLink>
                <div class="store-card-info">
                  <div class="store-card-head">
                    <h3>{{ game.name }}</h3>
                    <el-tag type="success" v-if="game.discount > 0">-{{ game.discount }}%</el-tag>
                    <el-tag v-else>新品</el-tag>
                  </div>
                  <p>{{ game.summary }}</p>
                  <div class="tag-row">
                    <el-tag v-for="tag in game.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                  </div>
                  <div class="store-card-bottom">
                    <strong>{{ game.price === 0 ? '免费游玩' : '¥' + game.price }}</strong>
                    <el-button size="small" type="primary" @click="addCart(game)">加入愿望单</el-button>
                  </div>
                </div>
              </article>
            </div>
          </el-tab-pane>
          <el-tab-pane label="表格视图" name="table">
            <el-table :data="pagedGames" class="store-table">
              <el-table-column prop="name" label="游戏名称" min-width="160" />
              <el-table-column prop="categoryName" label="分类" width="120" />
              <el-table-column prop="score" label="评分" width="90" />
              <el-table-column prop="players" label="关注人数" width="120" />
              <el-table-column label="价格" width="100">
                <template #default="scope">
                  <span class="price">{{ scope.row.price === 0 ? '免费' : '¥' + scope.row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="scope">
                  <el-button text type="primary" @click="goDetail(scope.row.id)">详情</el-button>
                  <el-button text type="success" @click="addCart(scope.row)">愿望单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

        <!-- 分页器：page-size 固定 8，total 用筛选后的总数 -->
        <div class="pager">
          <el-pagination
            v-model:current-page="page"
            background
            layout="prev, pager, next"
            :page-size="8"
            :total="filteredGames.length"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<!-- 游戏库视图 - 支持筛选、排序、搜索和分页，提供卡片/表格两种视图模式 -->
<script setup>
import axios from '@/api'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useGameStore } from '../stores/counter'

const API = 'http://localhost:3003'
const router = useRouter()
const gameStore = useGameStore()
// 游戏列表
const games = ref([])
// 分类列表
const categories = ref([])
// 当前页码
const page = ref(1)
// 视图模式：card（卡片）或 table（表格）
const viewMode = ref('card')
// filter 用 reactive 包成响应式对象，任一字段变化都会触发 filteredGames 重算
const filter = reactive({
  keyword: '',      // 搜索关键词
  category: '',     // 分类筛选
  sort: 'score',    // 排序方式：score/price/players
  freeOnly: false,  // 只看免费游戏
  maxPrice: 200,    // 最高价格
})

/**
 * 核心筛选逻辑：按价格、关键词、分类、免费过滤后，再按所选字段排序
 * 使用computed自动响应filter的变化
 */
const filteredGames = computed(() => {
  // 先按价格过滤
  let list = games.value.filter((game) => game.price <= filter.maxPrice)

  // 关键词搜索
  if (filter.keyword) {
    list = list.filter((game) => game.name.includes(filter.keyword))
  }

  // 分类筛选
  if (filter.category) {
    list = list.filter((game) => game.category === filter.category)
  }

  // 只看免费
  if (filter.freeOnly) {
    list = list.filter((game) => game.price === 0)
  }

  // 排序处理
  if (filter.sort === 'score') {
    list = [...list].sort((a, b) => b.score - a.score)
  } else if (filter.sort === 'price') {
    list = [...list].sort((a, b) => a.price - b.price)
  } else {
    list = [...list].sort((a, b) => b.players - a.players)
  }

  return list
})

/**
 * 分页：根据当前页码 page 截取 8 条
 */
const pagedGames = computed(() => {
  const start = (page.value - 1) * 8
  return filteredGames.value.slice(start, start + 8)
})

/**
 * 重置筛选：把 filter 还原成默认值，并回到第一页
 */
function resetFilter() {
  Object.assign(filter, {
    keyword: '',
    category: '',
    sort: 'score',
    freeOnly: false,
    maxPrice: 200,
  })
  page.value = 1
}

function goDetail(id) {
  router.push({ name: 'gameDetail', params: { id } })
}

function addCart(game) {
  gameStore.addCart(game.id)
  ElMessage.success(`${game.name} 已加入愿望单`)
}

// 筛选条件一变就跳回第一页，避免停留在不存在的页码
watch(filter, () => {
  page.value = 1
})

// 组件挂载时加载游戏和分类数据
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
.store-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 18px;
  align-items: start;
}

.filter-panel {
  padding: 18px;
}

.filter-panel h2 {
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 800;
}

.category-link {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  border-radius: 6px;
  color: var(--text-second);
}

.category-link:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.06);
}

.price-filter {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.result-tools {
  display: grid;
  grid-template-columns: 1fr 150px 150px 120px;
  gap: 12px;
  padding: 14px;
  margin-bottom: 16px;
}

.store-tabs {
  min-height: 650px;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.store-card {
  overflow: hidden;
}

.store-card img {
  height: 230px;
}

.store-card-info {
  padding: 13px;
}

.store-card-head {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.store-card h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.store-card p {
  height: 45px;
  margin: 8px 0 10px;
  color: var(--text-second);
  overflow: hidden;
}

.tag-row {
  height: 28px;
  display: flex;
  gap: 6px;
  overflow: hidden;
}

.store-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.store-card-bottom strong {
  color: var(--warning);
  font-size: 18px;
  font-weight: 800;
}

.store-table {
  border-radius: 8px;
  overflow: hidden;
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
