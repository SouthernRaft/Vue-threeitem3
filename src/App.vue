<!-- 根组件 -->
<template>
  <div class="app-shell">
    <Topnav />
    <RouterView /> <!-- 路由视图容器，显示当前路由对应的组件 -->
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Topnav from './components/Topnav.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}
</style>
