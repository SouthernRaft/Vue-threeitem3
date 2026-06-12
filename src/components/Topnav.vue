<!-- 顶部导航栏组件 -->
<template>
  <!-- el-affix 固钉组件：让导航栏滚动时固定在顶部 -->
  <el-affix :offset="0">
    <header class="topnav">
      <div class="topnav-inner">
        <!-- Logo，点击返回首页 -->
        <RouterLink class="brand" to="/">
          <el-icon><Platform /></el-icon>
          <span>GameHub 1302</span>
        </RouterLink>

        <!-- 主导航菜单 -->
        <nav class="links">
          <!-- v-for遍历navs数组生成导航链接 -->
          <!-- router-link-active类会自动添加到当前激活的链接上 -->
          <RouterLink v-for="item in navs" :key="item.id" :to="item.path" class="nav-link">
            <el-icon>
              <!-- component :is 动态渲染图标组件 -->
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </RouterLink>
        </nav>

        <!-- 搜索区域 -->
        <div class="nav-actions">
          <!-- @keyup.enter 按Enter键触发搜索 -->
          <el-input
            v-model="keyword"
            class="search"
            placeholder="搜索游戏"
            clearable
            @keyup.enter="goSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" :icon="Search" @click="goSearch">搜索</el-button>
        </div>
      </div>
    </header>
  </el-affix>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const keyword = ref('')

// 导航菜单配置
const navs = [
  { id: 1, title: '首页', path: '/', icon: 'House' },
  { id: 2, title: '游戏库', path: '/store', icon: 'Grid' },
  { id: 3, title: '特惠榜', path: '/deals', icon: 'Discount' },
  { id: 4, title: '玩家社区', path: '/community', icon: 'ChatLineRound' },
  { id: 5, title: '个人中心', path: '/profile', icon: 'User' },
]

// 跳转到搜索页面，通过query参数传递关键词
function goSearch() {
  router.push({ name: 'search', query: { keyword: keyword.value } })
}
</script>

<style scoped>
.topnav {
  position: relative;
  z-index: 20;
  background: rgba(18, 21, 28, 0.96);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(12px);
}

.topnav-inner {
  width: 1180px;
  height: 74px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
  font-size: 22px;
  font-weight: 800;
  white-space: nowrap;
}

.brand .el-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #101114;
  background: var(--brand);
}

.links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.nav-link {
  height: 42px;
  padding: 0 13px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-second);
  transition: 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-main);
  background: rgba(32, 214, 181, 0.14);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search {
  width: 220px;
}
</style>
