<template>
  <main class="page">
    <section class="not-found panel">
      <el-result
        icon="warning"
        title="404"
        sub-title="当前页面不存在，请返回游戏商店首页。"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
          <el-button @click="$router.push('/store')">去游戏库</el-button>
        </template>
      </el-result>
    </section>
  </main>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  padding: 70px 0;
}
</style>
