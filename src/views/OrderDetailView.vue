<template>
  <main class="page" v-if="order">
    <div class="page-title">
      <div>
        <h1>订单详情 #{{ order.id }}</h1>
        <p>参数路由：/order/{{ order.id }}，订单和游戏信息均来自 json-server。</p>
      </div>
      <el-button type="primary" @click="$router.push('/profile')">返回个人中心</el-button>
    </div>

    <section class="order-detail panel">
      <el-result
        :icon="order.status === '已完成' ? 'success' : 'warning'"
        :title="order.status"
        :sub-title="order.name"
      />
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ order.id }}</el-descriptions-item>
        <el-descriptions-item label="购买日期">{{ order.date }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ order.pay }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">¥{{ order.price }}</el-descriptions-item>
        <el-descriptions-item label="游戏名称">{{ order.name }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ order.status }}</el-descriptions-item>
      </el-descriptions>

      <!-- 关联游戏信息 -->
      <div class="game-link" v-if="game">
        <img :src="game.cover" :alt="game.name">
        <div>
          <h2>{{ game.name }}</h2>
          <p>{{ game.summary }}</p>
          <el-button type="primary" @click="$router.push({ name: 'gameDetail', params: { id: game.id } })">
            查看游戏
          </el-button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import axios from '@/api'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const API = 'http://localhost:3003'
const route = useRoute()
const order = ref(null)
const game = ref(null)

// Promise链式调用：先获取订单，再根据订单中的gameId获取游戏
onMounted(() => {
  axios.get(`${API}/orders/${route.params.id}`).then((res) => {
    order.value = res.data
    return axios.get(`${API}/games/${res.data.gameId}`)
  }).then((res) => {
    game.value = res.data
  })
})
</script>

<style scoped>
.order-detail {
  padding: 22px;
}

.game-link {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 18px;
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.game-link img {
  width: 130px;
  height: 170px;
  object-fit: cover;
  border-radius: 8px;
}

.game-link h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 900;
}

.game-link p {
  color: var(--text-second);
}
</style>
