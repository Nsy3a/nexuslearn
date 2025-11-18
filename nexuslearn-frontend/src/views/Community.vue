<template>
  <div class="community-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">AI社区</h1>
      <p class="page-subtitle">多元圈层结构，AI驱动的协作空间</p>
    </div>

    <!-- 社区统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card glass-card">
        <div class="stat-icon friends">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.friends }}</h3>
          <p>好友数量</p>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon circles">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.circles }}</h3>
          <p>加入圈子</p>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon topics">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.topics }}</h3>
          <p>参与话题</p>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon contributions">
          <el-icon><Trophy /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.contributions }}</h3>
          <p>贡献值</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 左侧：AI帮问助手 -->
      <div class="ai-assistant-panel glass-card">
        <div class="panel-header">
          <h2>AI帮问助手</h2>
          <el-switch
            v-model="aiAssistant.enabled"
            active-text="启用"
            inactive-text="关闭"
          />
        </div>
        
        <div v-if="aiAssistant.enabled" class="ai-content">
          <div class="ai-status">
            <el-icon class="status-icon" :class="{ active: aiAssistant.active }">
              <MagicStick />
            </el-icon>
            <span class="status-text">
              {{ aiAssistant.active ? 'AI助手在线' : 'AI助手待机' }}
            </span>
          </div>
          
          <div class="ai-suggestions">
            <h4>智能建议</h4>
            <div class="suggestion-list">
              <div 
                v-for="suggestion in aiSuggestions" 
                :key="suggestion.id"
                class="suggestion-item"
                @click="applySuggestion(suggestion)"
              >
                <el-icon><Lightning /></el-icon>
                <span>{{ suggestion.text }}</span>
                <el-tag size="mini" :type="suggestion.type">
                  {{ getSuggestionTypeLabel(suggestion.type) }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div class="ai-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="generateSmartQuestion"
              :loading="generatingQuestion"
            >
              <el-icon><Edit /></el-icon>
              生成智能问题
            </el-button>
            <el-button 
              size="small" 
              @click="matchExperts"
              :loading="matchingExperts"
            >
              <el-icon><Connection /></el-icon>
              匹配专家
            </el-button>
          </div>
        </div>
        
        <div v-else class="ai-disabled">
          <el-icon class="disabled-icon"><SwitchButton /></el-icon>
          <p>启用AI帮问助手获得智能建议</p>
        </div>
      </div>

      <!-- 中间：社区内容 -->
      <div class="community-content glass-card">
        <!-- 标签页导航 -->
        <div class="community-tabs">
          <button 
            :class="{ active: activeTab === 'friends', 'tab-btn': true }" 
            @click="activeTab = 'friends'"
          >
            <el-icon><User /></el-icon>
            朋友圈
          </button>
          <button 
            :class="{ active: activeTab === 'circles', 'tab-btn': true }" 
            @click="activeTab = 'circles'"
          >
            <el-icon><CircleCheck /></el-icon>
            兴趣圈
          </button>
          <button 
            :class="{ active: activeTab === 'topics', 'tab-btn': true }" 
            @click="activeTab = 'topics'"
          >
            <el-icon><ChatDotRound /></el-icon>
            话题圈
          </button>
        </div>

        <!-- 朋友圈内容 -->
        <div v-if="activeTab === 'friends'" class="tab-content">
          <div class="content-header">
            <h3>好友动态</h3>
            <el-button type="primary" size="small" @click="showPostDialog = true">
              <el-icon><Plus /></el-icon>
              发布动态
            </el-button>
          </div>

          <div class="post-composer" v-if="showPostDialog">
            <div class="composer-input">
              <el-input
                v-model="newPost.content"
                type="textarea"
                :rows="3"
                placeholder="分享你的想法、学习心得或项目进展..."
                maxlength="500"
                show-word-limit
              />
            </div>
            <div class="composer-actions">
              <div class="composer-tools">
                <el-button size="small" text @click="addImage">
                  <el-icon><Picture /></el-icon>
                  图片
                </el-button>
                <el-button size="small" text @click="addCode">
                  <el-icon><Document /></el-icon>
                  代码
                </el-button>
                <el-button size="small" text @click="addTopic">
                  <el-icon><PriceTag /></el-icon>
                  话题
                </el-button>
              </div>
              <div class="composer-submit">
                <el-button size="small" @click="cancelPost">取消</el-button>
                <el-button type="primary" size="small" @click="publishPost">
                  发布
                </el-button>
              </div>
            </div>
          </div>

          <div class="friends-timeline">
            <div v-if="friendPosts.length === 0" class="empty-state">
              <el-icon class="empty-icon"><User /></el-icon>
              <h4>暂无好友动态</h4>
              <p>添加好友或发布第一条动态开始社交学习</p>
              <el-button type="primary" size="small" @click="showAddFriendDialog = true">
                添加好友
              </el-button>
            </div>
            
            <div v-for="post in friendPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <div class="user-avatar">
                  <el-avatar :size="40" :src="post.avatar">
                    {{ post.author.charAt(0) }}
                  </el-avatar>
                </div>
                <div class="post-info">
                  <div class="author-name">{{ post.author }}</div>
                  <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                </div>
                <el-dropdown trigger="click">
                  <el-button size="small" text>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="likePost(post.id)">
                        <el-icon><Star /></el-icon>
                        点赞
                      </el-dropdown-item>
                      <el-dropdown-item @click="sharePost(post.id)">
                        <el-icon><Share /></el-icon>
                        分享
                      </el-dropdown-item>
                      <el-dropdown-item @click="reportPost(post.id)" divided>
                        <el-icon><Warning /></el-icon>
                        举报
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              
              <div class="post-content">
                <p>{{ post.content }}</p>
                <div v-if="post.images && post.images.length" class="post-images">
                  <el-image
                    v-for="(image, index) in post.images" 
                    :key="index" 
                    :src="image"
                    :preview-src-list="post.images"
                    class="post-image"
                    fit="cover"
                  />
                </div>
                <div v-if="post.code" class="post-code">
                  <pre><code>{{ post.code }}</code></pre>
                </div>
              </div>
              
              <div class="post-stats">
                <div class="stat-item" @click="toggleLikes(post.id)">
                  <el-icon><Star /></el-icon>
                  <span>{{ post.likes.length }}</span>
                </div>
                <div class="stat-item" @click="toggleComments(post.id)">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ post.comments.length }}</span>
                </div>
                <div class="stat-item" @click="sharePost(post.id)">
                  <el-icon><Share /></el-icon>
                  <span>{{ post.shares }}</span>
                </div>
              </div>
              
              <div v-if="showComments[post.id]" class="comments-section">
                <div class="comments-list">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                    <div class="comment-avatar">
                      <el-avatar :size="24" :src="comment.avatar">
                        {{ comment.author.charAt(0) }}
                      </el-avatar>
                    </div>
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                      </div>
                      <p class="comment-text">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
                <div class="comment-form">
                  <el-input
                    v-model="commentInputs[post.id]"
                    placeholder="写评论..."
                    size="small"
                    @keyup.enter="addComment(post.id)"
                  >
                    <template #suffix>
                      <el-button 
                        type="primary" 
                        size="small" 
                        text
                        @click="addComment(post.id)"
                      >
                        发送
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 兴趣圈内容 -->
        <div v-else-if="activeTab === 'circles'" class="tab-content">
          <div class="content-header">
            <h3>兴趣圈子</h3>
            <el-button type="primary" size="small" @click="showCreateCircleDialog = true">
              <el-icon><Plus /></el-icon>
              创建圈子
            </el-button>
          </div>

          <div class="circles-grid">
            <div v-for="circle in interestCircles" :key="circle.id" class="circle-card">
              <div class="circle-header">
                <div class="circle-icon">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div class="circle-info">
                  <h4 class="circle-name">{{ circle.name }}</h4>
                  <p class="circle-desc">{{ circle.description }}</p>
                </div>
                <el-tag 
                  :type="circle.joined ? 'success' : 'info'" 
                  size="small"
                  class="join-status"
                >
                  {{ circle.joined ? '已加入' : '未加入' }}
                </el-tag>
              </div>
              
              <div class="circle-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ circle.members }}</span>
                  <span class="stat-label">成员</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ circle.posts }}</span>
                  <span class="stat-label">讨论</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ circle.resources }}</span>
                  <span class="stat-label">资源</span>
                </div>
              </div>
              
              <div class="circle-actions">
                <el-button 
                  :type="circle.joined ? 'default' : 'primary'" 
                  size="small"
                  @click="toggleCircleMembership(circle)"
                >
                  {{ circle.joined ? '退出圈子' : '加入圈子' }}
                </el-button>
                <el-button size="small" @click="viewCircle(circle)">
                  查看详情
                </el-button>
              </div>
              
              <div class="circle-topics">
                <span class="topics-label">热门话题：</span>
                <el-tag
                  v-for="topic in circle.hotTopics"
                  :key="topic"
                  size="mini"
                  type="info"
                  class="topic-tag"
                  @click="viewTopic(topic)"
                >
                  {{ topic }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 话题圈内容 -->
        <div v-else-if="activeTab === 'topics'" class="tab-content">
          <div class="content-header">
            <h3>热门话题</h3>
            <el-button type="primary" size="small" @click="showCreateTopicDialog = true">
              <el-icon><Plus /></el-icon>
              创建话题
            </el-button>
          </div>

          <div class="topics-list">
            <div v-for="topic in hotTopics" :key="topic.id" class="topic-card">
              <div class="topic-header">
                <div class="topic-tag">
                  <el-icon><PriceTag /></el-icon>
                  <span>#{{ topic.tag }}</span>
                </div>
                <div class="topic-stats">
                  <div class="stat-item">
                    <el-icon><View /></el-icon>
                    <span>{{ topic.views }}</span>
                  </div>
                  <div class="stat-item">
                    <el-icon><ChatDotRound /></el-icon>
                    <span>{{ topic.discussions }}</span>
                  </div>
                  <div class="stat-item">
                    <el-icon><Star /></el-icon>
                    <span>{{ topic.followers }}</span>
                  </div>
                </div>
              </div>
              
              <div class="topic-content">
                <h4 class="topic-title">{{ topic.title }}</h4>
                <p class="topic-desc">{{ topic.description }}</p>
                <div class="topic-creator">
                  <el-avatar :size="24" :src="topic.creator.avatar">
                    {{ topic.creator.name.charAt(0) }}
                  </el-avatar>
                  <span class="creator-name">{{ topic.creator.name }}</span>
                  <span class="create-time">{{ formatTime(topic.createdAt) }}</span>
                </div>
              </div>
              
              <div class="topic-actions">
                <el-button 
                  :type="topic.followed ? 'primary' : 'default'" 
                  size="small"
                  @click="toggleTopicFollow(topic)"
                >
                  <el-icon><Star /></el-icon>
                  {{ topic.followed ? '已关注' : '关注' }}
                </el-button>
                <el-button size="small" @click="joinTopicDiscussion(topic)">
                  <el-icon><ChatDotRound /></el-icon>
                  参与讨论
                </el-button>
                <el-button size="small" text @click="shareTopic(topic)">
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：社区活动与推荐 -->
      <div class="community-sidebar glass-card">
        <div class="sidebar-section">
          <h3>今日推荐</h3>
          <div class="recommendation-list">
            <div v-for="item in recommendations" :key="item.id" class="recommendation-item">
              <div class="rec-icon">
                <el-icon><MagicStick /></el-icon>
              </div>
              <div class="rec-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
                <el-button size="small" text @click="viewRecommendation(item)">
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3>社区活动</h3>
          <div class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-time">{{ formatTime(activity.time) }}</div>
              <div class="activity-content">
                <el-icon><Bell /></el-icon>
                <span>{{ activity.content }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3>贡献排行</h3>
          <div class="contribution-ranking">
            <div 
              v-for="(user, index) in contributionRanking" 
              :key="user.id"
              class="ranking-item"
            >
              <div class="ranking-number" :class="`rank-${index + 1}`">
                {{ index + 1 }}
              </div>
              <el-avatar :size="32" :src="user.avatar">
                {{ user.name.charAt(0) }}
              </el-avatar>
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-score">{{ user.score }}分</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布动态对话框 -->
    <el-dialog
      v-model="showPostDialog"
      title="发布动态"
      width="600px"
      class="post-dialog"
    >
      <el-form :model="newPost" label-width="80px">
        <el-form-item label="内容">
          <el-input
            v-model="newPost.content"
            type="textarea"
            :rows="4"
            placeholder="分享你的想法..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="话题">
          <el-select
            v-model="newPost.topics"
            multiple
            placeholder="选择相关话题"
            style="width: 100%"
          >
            <el-option label="Web3.0" value="web3" />
            <el-option label="AI学习" value="ai-learning" />
            <el-option label="区块链" value="blockchain" />
            <el-option label="前端开发" value="frontend" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPostDialog = false">取消</el-button>
          <el-button type="primary" @click="publishPost">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  User, CircleCheck, ChatDotRound, Trophy, MagicStick, Lightning, 
  Edit, Connection, Plus, Picture, Document, PriceTag, MoreFilled,
  Star, Share, Warning, View, Bell, SwitchButton
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 活动标签
const activeTab = ref('friends')

// 社区统计数据
const stats = reactive({
  friends: 12,
  circles: 5,
  topics: 18,
  contributions: 2450
})

// AI助手状态
const aiAssistant = reactive({
  enabled: true,
  active: true
})

// AI建议数据
const aiSuggestions = ref([
  {
    id: 1,
    text: '基于你的学习记录，建议关注AI学习话题',
    type: 'learning'
  },
  {
    id: 2,
    text: '你的朋友正在讨论Web3.0，是否加入讨论？',
    type: 'social'
  },
  {
    id: 3,
    text: '发现3个与你兴趣匹配的专家用户',
    type: 'expert'
  }
])

// 动态数据
const friendPosts = ref([
  {
    id: 1,
    author: '张三',
    avatar: '',
    content: '今天学习了Vue 3的组合式API，感觉比Options API更灵活，代码组织也更清晰。分享一个自定义hook的示例...',
    images: [],
    code: 'import { ref, computed } from "vue"\n\nexport function useCounter() {\n  const count = ref(0)\n  const double = computed(() => count.value * 2)\n  \n  function increment() {\n    count.value++\n  }\n  \n  return { count, double, increment }\n}',
    topics: ['vue3', 'composition-api'],
    likes: [2, 3, 5],
    comments: [
      {
        id: 1,
        author: '李四',
        avatar: '',
        content: '写得很清楚，学习了！',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ],
    shares: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
])

// 兴趣圈数据
const interestCircles = ref([
  {
    id: 1,
    name: 'Web3.0技术圈',
    description: '探讨Web3.0、区块链、智能合约等前沿技术',
    joined: true,
    members: 245,
    posts: 1280,
    resources: 156,
    hotTopics: ['智能合约', 'DeFi', 'NFT']
  },
  {
    id: 2,
    name: 'AI学习交流群',
    description: '机器学习、深度学习、自然语言处理等AI技术讨论',
    joined: false,
    members: 189,
    posts: 892,
    resources: 203,
    hotTopics: ['深度学习', 'GPT模型', '计算机视觉']
  }
])

// 热门话题数据
const hotTopics = ref([
  {
    id: 1,
    tag: 'Web3未来',
    title: 'Web3.0的未来发展趋势',
    description: '探讨Web3.0技术的发展方向和应用前景，分析当前面临的挑战和机遇',
    views: 1250,
    discussions: 89,
    followers: 456,
    followed: true,
    creator: {
      name: '王教授',
      avatar: ''
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
])

// 推荐数据
const recommendations = ref([
  {
    id: 1,
    title: '推荐加入AI学习圈',
    description: '基于你的学习记录，这个圈子很适合你',
    type: 'circle'
  },
  {
    id: 2,
    title: '热门话题：区块链应用',
    description: '讨论区块链在实际项目中的应用案例',
    type: 'topic'
  }
])

// 活动数据
const activities = ref([
  {
    id: 1,
    time: new Date(Date.now() - 30 * 60 * 1000),
    content: '张三点赞了你的动态'
  },
  {
    id: 2,
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    content: '李四评论了你的学习笔记'
  }
])

// 贡献排行数据
const contributionRanking = ref([
  {
    id: 1,
    name: '专家用户A',
    avatar: '',
    score: 2840
  },
  {
    id: 2,
    name: '活跃用户B',
    avatar: '',
    score: 2560
  },
  {
    id: 3,
    name: '贡献者C',
    avatar: '',
    score: 2340
  }
])

// 对话框状态
const showPostDialog = ref(false)
const showAddFriendDialog = ref(false)
const showCreateCircleDialog = ref(false)
const showCreateTopicDialog = ref(false)

// 新动态数据
const newPost = reactive({
  content: '',
  topics: []
})

// 评论输入
const commentInputs = ref<Record<number, string>>({})
const showComments = ref<Record<number, boolean>>({})

// 加载状态
const generatingQuestion = ref(false)
const matchingExperts = ref(false)

// 方法函数
const getSuggestionTypeLabel = (type: string) => {
  const labels = {
    learning: '学习',
    social: '社交',
    expert: '专家'
  } as const
  return labels[type as keyof typeof labels] || '其他'
}

const applySuggestion = (suggestion: any) => {
  ElMessage.success(`已应用建议: ${suggestion.text}`)
}

const generateSmartQuestion = () => {
  generatingQuestion.value = true
  setTimeout(() => {
    ElMessage.success('智能问题生成成功')
    generatingQuestion.value = false
  }, 2000)
}

const matchExperts = () => {
  matchingExperts.value = true
  setTimeout(() => {
    ElMessage.success('专家匹配完成')
    matchingExperts.value = false
  }, 2000)
}

const publishPost = () => {
  if (!newPost.content.trim()) {
    ElMessage.warning('请输入动态内容')
    return
  }
  
  const post = {
    id: Date.now(),
    author: '当前用户',
    avatar: '',
    content: newPost.content,
    images: [],
    code: '',
    topics: newPost.topics,
    likes: [],
    comments: [],
    shares: 0,
    createdAt: new Date()
  }
  
  friendPosts.value.unshift(post)
  
  // 重置表单
  newPost.content = ''
  newPost.topics = []
  showPostDialog.value = false
  
  ElMessage.success('动态发布成功')
}

const addImage = () => { ElMessage.info('添加图片') }
const addCode = () => { ElMessage.info('添加代码') }
const addTopic = () => { ElMessage.info('添加话题') }
const cancelPost = () => { showPostDialog.value = false }
const sharePost = (_postId: number) => { ElMessage.success('已分享') }
const reportPost = (_postId: number) => { ElMessage.success('已举报') }
const toggleLikes = (postId: number) => { likePost(postId) }
const viewTopic = (_topic: any) => { ElMessage.info('查看话题') }

const likePost = (postId: number) => {
  const post = friendPosts.value.find(p => p.id === postId)
  if (post) {
    const userLiked = post.likes.includes(1) // 假设当前用户ID为1
    if (userLiked) {
      post.likes = post.likes.filter(id => id !== 1)
    } else {
      post.likes.push(1)
    }
  }
}

const toggleComments = (postId: number) => {
  showComments.value[postId] = !showComments.value[postId]
}

const addComment = (postId: number) => {
  const content = commentInputs.value[postId]
  if (!content?.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  const post = friendPosts.value.find(p => p.id === postId)
  if (post) {
    const comment = {
      id: Date.now(),
      author: '当前用户',
      avatar: '',
      content: content,
      createdAt: new Date()
    }
    post.comments.push(comment)
    commentInputs.value[postId] = ''
    ElMessage.success('评论发布成功')
  }
}

const toggleCircleMembership = (circle: any) => {
  circle.joined = !circle.joined
  ElMessage.success(circle.joined ? '已加入圈子' : '已退出圈子')
}

const viewCircle = (circle: any) => {
  ElMessage.info(`查看圈子详情: ${circle.name}`)
}

const toggleTopicFollow = (topic: any) => {
  topic.followed = !topic.followed
  ElMessage.success(topic.followed ? '已关注话题' : '已取消关注')
}

const joinTopicDiscussion = (topic: any) => {
  ElMessage.info(`参与话题讨论: ${topic.title}`)
}

const shareTopic = (topic: any) => {
  ElMessage.success(`话题分享成功: ${topic?.title || ''}`)
}

const viewRecommendation = (recommendation: any) => {
  ElMessage.info(`查看推荐: ${recommendation.title}`)
}

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return timestamp.toLocaleDateString()
}

onMounted(() => {
  ElMessage.success('AI社区已加载')
})
</script>

<style scoped>
.community-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--app-bg);
  background-attachment: fixed;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  color: var(--text-primary);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.friends {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.stat-icon.circles {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
}

.stat-icon.topics {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
}

.stat-icon.contributions {
  background: linear-gradient(135deg, #F56C6C, #f78989);
}

.stat-content h3 {
  margin: 0 0 4px 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.stat-content p {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 300px 1fr 280px;
  gap: 24px;
}

.glass-card {
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  border: 1px solid var(--border-color);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.3rem;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(103, 194, 58, 0.1);
  border-radius: 8px;
  border-left: 3px solid #67C23A;
}

.status-icon {
  color: #67C23A;
  font-size: 18px;
}

.status-icon.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-text {
  color: var(--text-primary);
  font-weight: 500;
}

.suggestion-list {
  margin-bottom: 16px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background: rgba(64, 158, 255, 0.1);
}

.suggestion-item .el-icon {
  color: #409EFF;
  font-size: 16px;
}

.suggestion-item span {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.ai-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-disabled {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
}

.disabled-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.community-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: saturate(1.2) blur(20px);
  border-radius: 12px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary);
}

.tab-btn.active {
  background: #409EFF;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.content-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.post-composer {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: saturate(1.2) blur(20px);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.composer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.composer-tools {
  display: flex;
  gap: 8px;
}

.composer-submit {
  display: flex;
  gap: 8px;
}

.friends-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.post-card {
  background: var(--card-bg-strong);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  flex-shrink: 0;
}

.post-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.post-time {
  color: var(--text-tertiary);
  font-size: 0.8rem;
}

.post-content {
  margin-bottom: 16px;
}

.post-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.post-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.post-image:hover {
  filter: brightness(1.05);
}

.post-code {
  margin-top: 12px;
}

.post-code pre {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow-x: auto;
}

.post-stats {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover {
  color: #409EFF;
}

.stat-item .el-icon {
  font-size: 16px;
}

.comments-section {
  margin-top: 16px;
}

.comments-list {
  margin-bottom: 12px;
}

.comment-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.comment-time {
  color: #909399;
  font-size: 0.8rem;
}

.comment-text {
  color: #606266;
  font-size: 0.9rem;
  margin: 0;
}

.comment-form {
  display: flex;
  gap: 8px;
}

.circles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.circle-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.circle-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.circle-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.circle-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.circle-info {
  flex: 1;
}

.circle-name {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.circle-desc {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
  line-height: 1.4;
}

.join-status {
  margin: 0;
}

.circle-stats {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.8rem;
  color: #909399;
}

.circle-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.circle-topics {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.topics-label {
  color: #606266;
  font-size: 0.9rem;
  font-weight: 500;
}

.topic-tag {
  margin: 0;
  cursor: pointer;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.topic-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.topic-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #e6a23c, #ebb563);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.topic-stats {
  display: flex;
  gap: 16px;
}

.topic-content {
  margin-bottom: 16px;
}

.topic-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.topic-desc {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.topic-creator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.creator-name {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.create-time {
  color: #909399;
  font-size: 0.8rem;
}

.topic-actions {
  display: flex;
  gap: 8px;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.recommendation-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  background: rgba(255, 255, 255, 0.8);
}

.rec-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.rec-content h4 {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.rec-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 0.8rem;
  line-height: 1.4;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  color: #909399;
  font-size: 0.8rem;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 0.9rem;
}

.contribution-ranking {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.ranking-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.ranking-number.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.ranking-number.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
}

.ranking-number.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #A0522D);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.user-score {
  color: #e6a23c;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .community-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .circles-grid {
    grid-template-columns: 1fr;
  }
  
  .community-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
}
</style>