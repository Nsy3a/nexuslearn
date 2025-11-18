<template>
  <div class="context-engine-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">上下文引擎中心</h1>
      <p class="page-subtitle">个性化学习偏好与历史交互管理</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 左侧：用户画像面板 -->
      <div class="profile-panel glass-card">
        <div class="panel-header">
          <h2>用户画像</h2>
          <el-button type="primary" size="small" @click="editProfile">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
        </div>
        
        <div class="profile-content">
          <div class="profile-section">
            <h3>学习目标</h3>
            <div class="goal-tags">
              <el-tag
                v-for="goal in userProfile.goals"
                :key="goal"
                type="success"
                effect="dark"
                class="goal-tag"
              >
                {{ goal }}
              </el-tag>
            </div>
          </div>

          <div class="profile-section">
            <h3>知识短板</h3>
            <div class="weakness-list">
              <div 
                v-for="weakness in userProfile.weaknesses" 
                :key="weakness.area"
                class="weakness-item"
              >
                <span class="area">{{ weakness.area }}</span>
                <el-progress 
                  :percentage="weakness.improvement" 
                  :color="getProgressColor(weakness.improvement)"
                  class="improvement-bar"
                />
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h3>内容偏好</h3>
            <div class="preference-grid">
              <div class="preference-item">
                <span class="label">内容形式：</span>
                <el-tag type="info">{{ userProfile.preferences.contentFormat }}</el-tag>
              </div>
              <div class="preference-item">
                <span class="label">互动风格：</span>
                <el-tag type="info">{{ userProfile.preferences.interactionStyle }}</el-tag>
              </div>
              <div class="preference-item">
                <span class="label">难度偏好：</span>
                <el-tag type="info">{{ userProfile.preferences.difficulty }}</el-tag>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h3>规避规则</h3>
            <div class="avoid-rules">
              <el-alert
                v-for="rule in userProfile.avoidRules"
                :key="rule"
                :title="rule"
                type="warning"
                :closable="false"
                class="avoid-rule"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：历史交互记录 -->
      <div class="history-panel glass-card">
        <div class="panel-header">
          <h2>最近交互历史</h2>
          <el-button-group size="small">
            <el-button @click="filterHistory('all')" :type="filterType === 'all' ? 'primary' : ''">
              全部
            </el-button>
            <el-button @click="filterHistory('search')" :type="filterType === 'search' ? 'primary' : ''">
              搜索
            </el-button>
            <el-button @click="filterHistory('learning')" :type="filterType === 'learning' ? 'primary' : ''">
              学习
            </el-button>
            <el-button @click="filterHistory('collaboration')" :type="filterType === 'collaboration' ? 'primary' : ''">
              协作
            </el-button>
          </el-button-group>
        </div>

        <div class="history-timeline">
          <div 
            v-for="item in filteredHistory" 
            :key="item.id"
            class="timeline-item"
            :class="`type-${item.type}`"
          >
            <div class="timeline-marker">
              <el-icon class="timeline-icon">
                <Search v-if="item.type === 'search'" />
                <Reading v-else-if="item.type === 'learning'" />
                <Connection v-else-if="item.type === 'collaboration'" />
                <ChatDotRound v-else />
              </el-icon>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-type">{{ getTypeLabel(item.type) }}</span>
                <span class="timeline-time">{{ formatTime(item.timestamp) }}</span>
              </div>
              <div class="timeline-body">
                <p class="timeline-title">{{ item.title }}</p>
                <p class="timeline-desc">{{ item.description }}</p>
                <div v-if="item.intent" class="timeline-intent">
                  <el-tag size="small" type="info">识别意图: {{ item.intent }}</el-tag>
                </div>
              </div>
              <div class="timeline-actions">
                <el-button 
                  size="small" 
                  text 
                  @click="viewDetails(item)"
                >
                  查看详情
                </el-button>
                <el-button 
                  v-if="item.canContinue" 
                  size="small" 
                  type="primary" 
                  text
                  @click="continueInteraction(item)"
                >
                  继续交互
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="load-more" v-if="hasMoreHistory">
          <el-button @click="loadMoreHistory" :loading="loadingMore">
            加载更多
          </el-button>
        </div>
      </div>
    </div>

    <!-- 底部：智能分析面板 -->
    <div class="analysis-panel glass-card">
      <div class="panel-header">
        <h2>智能分析洞察</h2>
        <el-button type="primary" size="small" @click="refreshAnalysis">
          <el-icon><Refresh /></el-icon>刷新分析
        </el-button>
      </div>

      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="analysis-card">
              <div class="analysis-icon learning-pattern">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>学习模式分析</h3>
              <p class="analysis-text">{{ analysis.learningPattern }}</p>
              <div class="confidence-bar">
                <span class="confidence-label">置信度</span>
                <el-progress 
                  :percentage="analysis.confidence.learningPattern" 
                  :color="getConfidenceColor(analysis.confidence.learningPattern)"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="analysis-card">
              <div class="analysis-icon knowledge-gaps">
                <el-icon><Warning /></el-icon>
              </div>
              <h3>知识缺口识别</h3>
              <p class="analysis-text">{{ analysis.knowledgeGaps }}</p>
              <div class="confidence-bar">
                <span class="confidence-label">置信度</span>
                <el-progress 
                  :percentage="analysis.confidence.knowledgeGaps" 
                  :color="getConfidenceColor(analysis.confidence.knowledgeGaps)"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="analysis-card">
              <div class="analysis-icon next-steps">
                <el-icon><Compass /></el-icon>
              </div>
              <h3>下一步建议</h3>
              <p class="analysis-text">{{ analysis.nextSteps }}</p>
              <div class="confidence-bar">
                <span class="confidence-label">置信度</span>
                <el-progress 
                  :percentage="analysis.confidence.nextSteps" 
                  :color="getConfidenceColor(analysis.confidence.nextSteps)"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 编辑用户画像对话框 -->
    <el-dialog
      v-model="profileDialogVisible"
      title="编辑用户画像"
      width="600px"
      class="profile-dialog"
    >
      <el-form :model="editingProfile" label-width="100px">
        <el-form-item label="学习目标">
          <el-select
            v-model="editingProfile.goals"
            multiple
            placeholder="选择学习目标"
            style="width: 100%"
          >
            <el-option label="应试考证" value="exam" />
            <el-option label="技能提升" value="skill" />
            <el-option label="学术研究" value="research" />
            <el-option label="项目开发" value="project" />
            <el-option label="兴趣探索" value="hobby" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容偏好">
          <el-radio-group v-model="editingProfile.preferences.contentFormat">
            <el-radio label="图文">图文</el-radio>
            <el-radio label="视频">视频</el-radio>
            <el-radio label="音频">音频</el-radio>
            <el-radio label="交互式">交互式</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="互动风格">
          <el-radio-group v-model="editingProfile.preferences.interactionStyle">
            <el-radio label="主动引导">主动引导</el-radio>
            <el-radio label="被动回答">被动回答</el-radio>
            <el-radio label="平衡互动">平衡互动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="难度偏好">
          <el-radio-group v-model="editingProfile.preferences.difficulty">
            <el-radio label="基础">基础</el-radio>
            <el-radio label="进阶">进阶</el-radio>
            <el-radio label="专家">专家</el-radio>
            <el-radio label="自适应">自适应</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="规避规则">
          <el-input
            v-model="newAvoidRule"
            placeholder="输入要规避的内容规则"
            @keyup.enter="addAvoidRule"
          >
            <template #append>
              <el-button @click="addAvoidRule">添加</el-button>
            </template>
          </el-input>
          <div class="avoid-rules-list">
            <el-tag
              v-for="(rule, index) in editingProfile.avoidRules"
              :key="index"
              closable
              @close="removeAvoidRule(index)"
              class="avoid-rule-tag"
            >
              {{ rule }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="profileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  Edit, Search, Reading, Connection, ChatDotRound,
  TrendCharts, Warning, Compass, Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 用户画像数据
const userProfile = reactive({
  goals: ['应试考证', '技能提升', '项目开发'],
  weaknesses: [
    { area: 'JavaScript 高级特性', improvement: 65 },
    { area: '区块链技术', improvement: 45 },
    { area: '机器学习算法', improvement: 30 }
  ],
  preferences: {
    contentFormat: '图文',
    interactionStyle: '主动引导',
    difficulty: '自适应'
  },
  avoidRules: [
    '不推荐超过3年的技术文章',
    '排除纯理论无实践的内容',
    '避免过于简单的入门教程'
  ]
})

// 交互历史数据
const interactionHistory = ref([
  {
    id: 1,
    type: 'search',
    title: '搜索：Python机器学习库比较',
    description: '用户正在研究不同机器学习框架的优缺点',
    intent: '技术选型研究',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    canContinue: true
  },
  {
    id: 2,
    type: 'learning',
    title: '学习：Vue 3组合式API',
    description: '完成了组合式API的基础练习，掌握度80%',
    intent: '技能提升',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    canContinue: true
  },
  {
    id: 3,
    type: 'collaboration',
    title: '协作：Web3项目架构设计',
    description: '参与了去中心化学习平台的架构讨论',
    intent: '项目协作',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    canContinue: false
  }
])

// 过滤相关
const filterType = ref('all')
const filteredHistory = computed(() => {
  if (filterType.value === 'all') return interactionHistory.value
  return interactionHistory.value.filter(item => item.type === filterType.value)
})

// 加载更多相关
const loadingMore = ref(false)
const hasMoreHistory = ref(true)

// 智能分析数据
const analysis = reactive({
  learningPattern: '用户表现出强烈的技术深度探索倾向，偏好系统性的学习路径',
  knowledgeGaps: '在区块链和机器学习领域存在明显知识缺口，建议加强实践项目',
  nextSteps: '推荐参与Web3开源项目，将理论知识转化为实际技能',
  confidence: {
    learningPattern: 85,
    knowledgeGaps: 92,
    nextSteps: 78
  }
})

// 编辑相关
const profileDialogVisible = ref(false)
const editingProfile = reactive({
  goals: [...userProfile.goals],
  preferences: { ...userProfile.preferences },
  avoidRules: [...userProfile.avoidRules]
})
const newAvoidRule = ref('')

// 方法函数
const editProfile = () => {
  editingProfile.goals = [...userProfile.goals]
  editingProfile.preferences = { ...userProfile.preferences }
  editingProfile.avoidRules = [...userProfile.avoidRules]
  profileDialogVisible.value = true
}

const addAvoidRule = () => {
  if (newAvoidRule.value.trim()) {
    editingProfile.avoidRules.push(newAvoidRule.value.trim())
    newAvoidRule.value = ''
  }
}

const removeAvoidRule = (index: number) => {
  editingProfile.avoidRules.splice(index, 1)
}

const saveProfile = () => {
  Object.assign(userProfile, editingProfile)
  profileDialogVisible.value = false
  ElMessage.success('用户画像更新成功')
}

const filterHistory = (type: string) => {
  filterType.value = type
}

const viewDetails = (item: any) => {
  ElMessage.info(`查看详情功能开发中: ${item.title}`)
}

const continueInteraction = (item: any) => {
  ElMessage.success(`继续交互: ${item.title}`)
}

const loadMoreHistory = async () => {
  loadingMore.value = true
  // 模拟加载更多数据
  setTimeout(() => {
    const moreHistory = [
      {
        id: interactionHistory.value.length + 1,
        type: 'search',
        title: '搜索：IPFS分布式存储原理',
        description: '深入了解去中心化存储的技术细节',
        intent: '技术研究',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        canContinue: true
      }
    ]
    interactionHistory.value.push(...moreHistory)
    loadingMore.value = false
    hasMoreHistory.value = false // 模拟没有更多数据
  }, 1000)
}

const refreshAnalysis = () => {
  ElMessage.success('分析数据已刷新')
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 70) return '#67C23A'
  if (percentage >= 40) return '#E6A23C'
  return '#F56C6C'
}

const getConfidenceColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#409EFF'
  return '#E6A23C'
}

const getTypeLabel = (type: string) => {
  const labels = {
    search: '搜索',
    learning: '学习',
    collaboration: '协作',
    chat: '对话'
  } as const
  type Key = keyof typeof labels
  return (labels[type as Key]) || '其他'
}

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

onMounted(() => {
  // 初始化数据加载
  ElMessage.success('上下文引擎已加载')
})
</script>

<style scoped>
.context-engine-container {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.panel-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.profile-section {
  margin-bottom: 24px;
}

.profile-section h3 {
  color: #34495e;
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 600;
}

.goal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.goal-tag {
  border-radius: 20px;
  font-weight: 500;
}

.weakness-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weakness-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.area {
  min-width: 140px;
  font-weight: 500;
  color: #2c3e50;
}

.improvement-bar {
  flex: 1;
}

.preference-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 500;
  color: #2c3e50;
  min-width: 80px;
}

.avoid-rules {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avoid-rule {
  margin: 0;
}

.history-timeline {
  position: relative;
  padding-left: 32px;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-left: 16px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #409EFF;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 24px;
  width: 2px;
  height: calc(100% + 8px);
  background: linear-gradient(to bottom, #409EFF, transparent);
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-marker {
  position: absolute;
  left: -32px;
  top: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-icon {
  font-size: 18px;
  color: #409EFF;
}

.timeline-content {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-type {
  font-weight: 600;
  color: #409EFF;
  font-size: 0.9rem;
}

.timeline-time {
  color: #909399;
  font-size: 0.8rem;
}

.timeline-title {
  font-weight: 600;
  color: #2c3e50;
  margin: 8px 0 4px 0;
}

.timeline-desc {
  color: #606266;
  margin: 4px 0 8px 0;
  line-height: 1.5;
}

.timeline-intent {
  margin-top: 8px;
}

.timeline-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.load-more {
  text-align: center;
  margin-top: 24px;
}

.analysis-panel {
  margin-top: 24px;
}

.analysis-content {
  margin-top: 20px;
}

.analysis-card {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-4px);
}

.analysis-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  color: white;
}

.analysis-icon.learning-pattern {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.analysis-icon.knowledge-gaps {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.analysis-icon.next-steps {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.analysis-card h3 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.analysis-text {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
  min-height: 48px;
}

.confidence-bar {
  margin-top: 12px;
}

.confidence-label {
  display: block;
  font-size: 0.8rem;
  color: #909399;
  margin-bottom: 4px;
}

.avoid-rules-list {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.avoid-rule-tag {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .context-engine-container {
    padding: 16px;
  }
  
  .glass-card {
    padding: 16px;
  }
}

/* 时间线类型颜色 */
.timeline-item.type-search::before {
  background: #409EFF;
}

.timeline-item.type-learning::before {
  background: #67C23A;
}

.timeline-item.type-collaboration::before {
  background: #E6A23C;
}

.timeline-item.type-chat::before {
  background: #F56C6C;
}
</style>