<template>
  <main class="page">
    <div class="page-title">
      <div>
        <h1>个人中心</h1>
        <p>展示用户资料、订单记录、收藏数据和表单设置。</p>
      </div>
      <el-badge :value="gameStore.favoriteCount" class="favorite-badge">
        <el-button type="success" :icon="Star">我的收藏</el-button>
      </el-badge>
    </div>

    <section class="profile-layout">
      <aside>
        <!-- 用户资料卡 -->
        <div class="profile-card panel">
          <el-avatar :size="76" src="/placeholder/avatar.svg" />
          <h2>{{ profile.name }}</h2>
          <p>学号后四位：{{ profile.studentId }}</p>
          <el-progress :percentage="gameStore.level * 2" color="#20d6b5" />
          <p class="motto">{{ profile.motto }}</p>
          <el-button type="primary" @click="saveProfile">保存资料</el-button>
        </div>

        <!-- 偏好设置表单 -->
        <el-card class="setting-card">
          <template #header>
            <strong>偏好设置表单</strong>
          </template>
          <el-form :model="form" label-width="88px">
            <el-form-item label="昵称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="等级">
              <el-slider v-model="form.level" :min="1" :max="60" />
            </el-form-item>
            <el-form-item label="主题">
              <el-radio-group v-model="form.theme">
                <el-radio-button label="深色" />
                <el-radio-button label="明亮" />
                <el-radio-button label="跟随系统" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="通知">
              <el-checkbox-group v-model="form.notice">
                <el-checkbox label="折扣提醒" />
                <el-checkbox label="社区回复" />
                <el-checkbox label="新品上线" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="接收邮件">
              <el-switch v-model="form.emailNotice" />
            </el-form-item>
          </el-form>
        </el-card>
      </aside>

      <section>
        <!-- 订单列表 -->
        <el-card class="order-card">
          <template #header>
            <div class="card-head">
              <strong>最近订单</strong>
              <span class="muted">共 {{ orders.length }} 条</span>
            </div>
          </template>
          <RouterLink
            v-for="order in orders"
            :key="order.id"
            class="order-line"
            :to="{ name: 'orderDetail', params: { id: order.id } }"
          >
            <div>
              <strong>{{ order.name }}</strong>
              <p>{{ order.date }} / {{ order.pay }}</p>
            </div>
            <el-tag :type="order.status === '已完成' ? 'success' : 'warning'">{{ order.status }}</el-tag>
            <span>¥{{ order.price }}</span>
          </RouterLink>
        </el-card>

        <!-- 收藏游戏表格 -->
        <el-card class="library-card">
          <template #header>
            <div class="card-head">
              <strong>收藏游戏</strong>
              <span class="muted">来自 Pinia 状态</span>
            </div>
          </template>
          <el-table :data="favoriteGames" height="360">
            <el-table-column prop="name" label="游戏" min-width="160" />
            <el-table-column prop="categoryName" label="分类" width="120" />
            <el-table-column prop="score" label="评分" width="90" />
            <el-table-column label="价格" width="100">
              <template #default="scope">
                <span class="price">{{ scope.row.price === 0 ? '免费' : '¥' + scope.row.price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </section>
    </section>
  </main>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { useGameStore } from '../stores/counter'

const API = 'http://localhost:3003'
const gameStore = useGameStore()
const orders = ref([])
const games = ref([])
const profile = ref({
  name: '刘英豪',
  studentId: '1302',
  motto: '把游戏商店做成能讲清楚的 Vue 项目',
})
// reactive对象，绑定到表单控件
const form = reactive({
  name: '刘英豪',
  level: 18,
  theme: '深色',
  notice: ['折扣提醒', '社区回复'],
  emailNotice: true,
})

// 从全部游戏中筛选出收藏的游戏
const favoriteGames = computed(() => {
  return games.value.filter((game) =>
    gameStore.favoriteIds.some((id) => String(id) === String(game.id)),
  )
})

function saveProfile() {
  profile.value.name = form.name
  gameStore.updateProfile(form.name, form.level)
  ElMessage.success('资料已保存到页面状态')
}

onMounted(() => {
  axios.get(`${API}/orders`).then((res) => {
    orders.value = res.data
  })
  axios.get(`${API}/games`).then((res) => {
    games.value = res.data
  })
})
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 18px;
}

.profile-card {
  padding: 24px;
  text-align: center;
}

.profile-card h2 {
  margin: 14px 0 4px;
  font-size: 24px;
  font-weight: 900;
}

.profile-card p {
  color: var(--text-second);
}

.motto {
  min-height: 48px;
  margin: 18px 0;
}

.setting-card {
  margin-top: 18px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-head strong {
  font-weight: 900;
}

.order-card {
  margin-bottom: 18px;
}

.order-line {
  display: grid;
  grid-template-columns: 1fr 90px 80px;
  gap: 14px;
  align-items: center;
  padding: 13px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.order-line strong {
  font-weight: 800;
}

.order-line p {
  margin: 3px 0 0;
  color: var(--text-second);
}

.order-line span {
  color: var(--warning);
  font-weight: 900;
  text-align: right;
}
</style>
