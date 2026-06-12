<template>
  <main class="page">
    <div class="page-title">
      <div>
        <h1>特惠榜</h1>
        <p>展示限时折扣、优惠券和价格对比，数据全部来自 game.json。</p>
      </div>
      <!-- :value绑定计算属性，数据变化时自动更新 -->
      <el-statistic title="平均折扣" :value="averageDiscount">
        <template #suffix>%</template>
      </el-statistic>
    </div>

    <div class="deal-top panel">
      <el-alert
        title="夏季游戏节：折扣数据由 json-server 模拟，点击卡片可进入对应游戏详情。"
        type="success"
        show-icon
        :closable="false"
      />
      <el-progress :percentage="averageDiscount" :stroke-width="16" color="#20d6b5" />
    </div>

    <!-- 折扣卡片列表 -->
    <section class="deal-grid">
      <article
        v-for="deal in deals"
        :key="deal.id"
        class="deal-card panel"
        @click="openGame(deal)"
      >
        <img :src="deal.cover" :alt="deal.name">
        <div class="deal-info">
          <el-tag type="danger" size="large" v-if="deal.discount > 0">-{{ deal.discount }}%</el-tag>
          <el-tag type="success" size="large" v-else>免费/原价</el-tag>
          <h3>{{ deal.name }}</h3>
          <p>{{ deal.reason }}</p>
          <div class="deal-price">
            <del v-if="deal.oldPrice > deal.nowPrice">¥{{ deal.oldPrice }}</del>
            <strong>{{ deal.nowPrice === 0 ? '免费' : '¥' + deal.nowPrice }}</strong>
          </div>
          <span>截止：{{ deal.until }}</span>
        </div>
      </article>
    </section>

    <!-- 优惠券区域 -->
    <section class="coupon-section">
      <div class="section-title">
        <h2>可领取优惠券</h2>
        <el-button type="primary" :icon="Ticket" @click="drawer = true">查看已领券包</el-button>
      </div>
      <div class="coupon-grid">
        <div v-for="coupon in coupons" :key="coupon.id" class="coupon-card panel">
          <div>
            <strong>¥{{ coupon.amount }}</strong>
            <h3>{{ coupon.name }}</h3>
            <p>{{ coupon.condition }}</p>
          </div>
          <el-button type="success" plain @click="takeCoupon(coupon)">领取</el-button>
        </div>
      </div>
    </section>

    <!-- v-model双向绑定drawer状态，控制抽屉显示/隐藏 -->
    <el-drawer v-model="drawer" title="我的券包" size="360px">
      <el-timeline>
        <el-timeline-item
          v-for="coupon in takenCoupons"
          :key="coupon.id"
          :timestamp="coupon.condition"
          type="success"
        >
          {{ coupon.name }}：减 {{ coupon.amount }} 元
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="takenCoupons.length === 0" description="还没有领取优惠券" />
    </el-drawer>
  </main>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Ticket } from '@element-plus/icons-vue'

const API = 'http://localhost:3003'
const router = useRouter()
const deals = ref([])
const coupons = ref([])
const takenCoupons = ref([])
const drawer = ref(false)

// 计算平均折扣：reduce累加所有折扣值，除以数量
const averageDiscount = computed(() => {
  if (deals.value.length === 0) return 0
  const total = deals.value.reduce((sum, item) => sum + item.discount, 0)
  return Math.round(total / deals.value.length)
})

function openGame(deal) {
  router.push({ name: 'gameDetail', params: { id: deal.gameId } })
}

// 领取优惠券：some()检查是否已领取，避免重复
function takeCoupon(coupon) {
  if (!takenCoupons.value.some((item) => item.id === coupon.id)) {
    takenCoupons.value.push(coupon)
    ElMessage.success(`已领取 ${coupon.name}`)
  } else {
    ElMessage.warning('这张优惠券已经领取过了')
  }
}

onMounted(() => {
  axios.get(`${API}/deals`).then((res) => {
    deals.value = res.data
  })
  axios.get(`${API}/coupons`).then((res) => {
    coupons.value = res.data
  })
})
</script>

<style scoped>
.deal-top {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 18px;
  align-items: center;
  padding: 16px;
  margin-bottom: 20px;
}

.deal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.deal-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.deal-card:hover {
  transform: translateY(-3px);
  border-color: rgba(32, 214, 181, 0.4);
}

.deal-card img {
  width: 96px;
  height: 132px;
  object-fit: cover;
  border-radius: 6px;
}

.deal-info h3 {
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 800;
}

.deal-info p,
.deal-info span {
  color: var(--text-second);
}

.deal-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.deal-price del {
  color: #6f7884;
}

.deal-price strong {
  color: var(--warning);
  font-size: 20px;
  font-weight: 900;
}

.coupon-section {
  margin-top: 34px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.coupon-card {
  min-height: 160px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-card strong {
  color: var(--brand);
  font-size: 30px;
  font-weight: 900;
}

.coupon-card h3 {
  margin: 8px 0 4px;
  font-size: 17px;
  font-weight: 800;
}

.coupon-card p {
  color: var(--text-second);
}
</style>
