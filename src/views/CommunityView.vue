<template>
  <main class="page">
    <div class="page-title">
      <div>
        <h1>玩家社区</h1>
        <p>社区页展示帖子、公告和发布表单，体现表单控件、双向绑定和事件处理。</p>
      </div>
      <el-button type="primary" :icon="Edit" @click="dialogVisible = true">发布帖子</el-button>
    </div>

    <section class="community-layout">
      <div>
        <!-- 标签切换 -->
        <el-tabs v-model="activeTag" class="community-tabs">
          <el-tab-pane label="全部" name="全部" />
          <el-tab-pane label="攻略" name="攻略" />
          <el-tab-pane label="心得" name="心得" />
          <el-tab-pane label="讨论" name="讨论" />
          <el-tab-pane label="学习" name="学习" />
        </el-tabs>

        <!-- 帖子列表 -->
        <article v-for="post in filteredPosts" :key="post.id" class="post-card panel">
          <el-avatar :src="post.avatar" :size="56" />
          <div class="post-main">
            <div class="post-head">
              <div>
                <strong>{{ post.title }}</strong>
                <p>{{ post.user }} 发布于 {{ post.game }}</p>
              </div>
              <el-tag>{{ post.tag }}</el-tag>
            </div>
            <p class="post-content">{{ post.content }}</p>
            <div class="post-actions">
              <el-button text type="primary" @click="likePost(post)">点赞 {{ post.likes }}</el-button>
              <el-button text>回复 {{ post.replies }}</el-button>
              <el-button text>收藏</el-button>
            </div>
          </div>
        </article>
      </div>

      <aside>
        <!-- 最新公告 -->
        <el-card class="side-card">
          <template #header>
            <strong>最新公告</strong>
          </template>
          <router-link
            v-for="item in news.slice(0, 5)"
            :key="item.id"
            class="news-link"
            :to="{ name: 'newsDetail', params: { id: item.id } }"
          >
            <el-tag size="small">{{ item.type }}</el-tag>
            <span>{{ item.title }}</span>
          </router-link>
        </el-card>

        <!-- 活跃话题 -->
        <el-card class="side-card">
          <template #header>
            <strong>活跃话题</strong>
          </template>
          <el-tag v-for="tag in topicTags" :key="tag" class="topic-tag" effect="plain">{{ tag }}</el-tag>
        </el-card>
      </aside>
    </section>

    <!-- 发帖对话框 -->
    <el-dialog v-model="dialogVisible" title="发布新帖子" width="560px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入帖子标题" />
        </el-form-item>
        <el-form-item label="游戏">
          <el-select v-model="form.game" placeholder="选择游戏">
            <el-option v-for="game in games" :key="game.id" :label="game.name" :value="game.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-radio-group v-model="form.tag">
            <el-radio-button label="攻略" />
            <el-radio-button label="心得" />
            <el-radio-button label="讨论" />
            <el-radio-button label="学习" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="分享你的游戏体验" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPost">发布</el-button>
      </template>
    </el-dialog>
  </main>
</template>

<script setup>
import axios from '@/api'
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

const API = 'http://localhost:3003'
const posts = ref([])
const news = ref([])
const games = ref([])
const activeTag = ref('全部')
const dialogVisible = ref(false)
const form = reactive({
  title: '',
  game: '',
  tag: '心得',
  content: '',
})

// 根据选中的标签过滤帖子
const filteredPosts = computed(() => {
  if (activeTag.value === '全部') return posts.value
  return posts.value.filter((post) => post.tag === activeTag.value)
})

const topicTags = ['星港远征', '学习游戏', '独立游戏', '折扣推荐', '截图分享', '攻略整理', '多人组队', '模拟经营']

function likePost(post) {
  post.likes += 1
  ElMessage.success('点赞成功')
}

// 发布帖子：校验后用unshift插入到列表开头
function submitPost() {
  if (!form.title || !form.game || !form.content) {
    ElMessage.warning('请把标题、游戏和内容填写完整')
    return
  }

  posts.value.unshift({
    id: Date.now(),
    user: '刘英豪',
    avatar: '/placeholder/avatar.svg',
    game: form.game,
    title: form.title,
    content: form.content,
    likes: 0,
    replies: 0,
    tag: form.tag,
  })
  dialogVisible.value = false
  form.title = ''
  form.game = ''
  form.content = ''
  ElMessage.success('帖子已发布到本地页面')
}

onMounted(() => {
  axios.get(`${API}/posts`).then((res) => {
    posts.value = res.data
  })
  axios.get(`${API}/news`).then((res) => {
    news.value = res.data
  })
  axios.get(`${API}/games`).then((res) => {
    games.value = res.data
  })
})
</script>

<style scoped>
.community-layout {
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: 18px;
}

.community-tabs {
  margin-bottom: 12px;
}

.post-card {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 14px;
  padding: 18px;
  margin-bottom: 14px;
}

.post-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.post-head strong {
  font-size: 18px;
  font-weight: 800;
}

.post-head p,
.post-content {
  margin: 4px 0 0;
  color: var(--text-second);
}

.post-content {
  margin-top: 12px;
  font-size: 15px;
}

.post-actions {
  margin-top: 10px;
}

.side-card {
  margin-bottom: 18px;
}

.news-link {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 8px;
  align-items: center;
  padding: 9px 0;
  color: var(--text-second);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.news-link span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.topic-tag {
  margin: 0 8px 8px 0;
}
</style>
