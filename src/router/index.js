// 路由配置文件
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // 首页直接导入
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/StoreView.vue'), // 懒加载
    },
    {
      path: '/deals',
      name: 'deals',
      component: () => import('../views/DealsView.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/game/:id', // 动态路由参数
      name: 'gameDetail',
      component: () => import('../views/GameDetailView.vue'),
    },
    {
      path: '/category/:type',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/order/:id',
      name: 'orderDetail',
      component: () => import('../views/OrderDetailView.vue'),
    },
    {
      path: '/news/:id',
      name: 'newsDetail',
      component: () => import('../views/NewsDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // 404路由，捕获所有未匹配的路径
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
