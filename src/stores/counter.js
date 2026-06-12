// Pinia状态管理 - 游戏商店的全局状态
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('gameStore1302', () => {
  // ===== 状态定义 =====
  const favoriteIds = ref(['1', '6', '10']) // 收藏的游戏ID列表
  const cartIds = ref(['2', '12']) // 购物车中的游戏ID列表
  const userName = ref('刘英豪')
  const level = ref(18)

  // ===== 计算属性 =====
  const favoriteCount = computed(() => favoriteIds.value.length)
  const cartCount = computed(() => cartIds.value.length)

  // ===== 方法定义 =====
  // 切换收藏状态：已收藏则移除，未收藏则添加
  function toggleFavorite(id) {
    const key = String(id)
    const index = favoriteIds.value.indexOf(key)
    if (index >= 0) {
      favoriteIds.value.splice(index, 1)
    } else {
      favoriteIds.value.push(key)
    }
  }

  // 添加到购物车：避免重复添加
  function addCart(id) {
    const key = String(id)
    if (!cartIds.value.includes(key)) {
      cartIds.value.push(key)
    }
  }

  function updateProfile(name, nextLevel) {
    userName.value = name
    level.value = nextLevel
  }

  return {
    favoriteIds,
    cartIds,
    userName,
    level,
    favoriteCount,
    cartCount,
    toggleFavorite,
    addCart,
    updateProfile,
  }
})
