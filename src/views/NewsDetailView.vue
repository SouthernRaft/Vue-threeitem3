<template>
  <main class="page" v-if="news">
    <div class="news-detail panel">
      <el-page-header @back="$router.back()" title="返回">
        <template #content>
          <span>{{ news.title }}</span>
        </template>
      </el-page-header>

      <article>
        <el-tag>{{ news.type }}</el-tag>
        <h1>{{ news.title }}</h1>
        <p class="date">{{ news.date }}</p>
        <p class="summary">{{ news.summary }}</p>
        <el-divider />
        <p class="content">{{ news.content }}</p>
      </article>
    </div>
  </main>
</template>

<script setup>
import axios from '@/api'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const API = 'http://localhost:3003'
const route = useRoute()
const news = ref(null)

onMounted(() => {
  axios.get(`${API}/news/${route.params.id}`).then((res) => {
    news.value = res.data
  })
})
</script>

<style scoped>
.news-detail {
  padding: 26px;
}

article {
  width: 780px;
  margin: 34px auto 0;
}

article h1 {
  margin: 16px 0 8px;
  font-size: 34px;
  font-weight: 900;
}

.date {
  color: var(--text-second);
}

.summary {
  margin-top: 22px;
  color: #dce5ef;
  font-size: 18px;
}

.content {
  color: var(--text-second);
  font-size: 16px;
  line-height: 2;
  text-indent: 2em;
}
</style>
