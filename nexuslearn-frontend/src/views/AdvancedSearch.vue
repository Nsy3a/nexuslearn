<template>
  <div class="advanced-search-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">智能搜索引擎</h1>
      <p class="page-subtitle">意图驱动的联合搜索与智能摘要</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section glass-card">
      <div class="search-input-group">
        <el-input
          v-model="searchQuery"
          placeholder="输入搜索关键词，如：机器学习入门项目代码..."
          size="large"
          clearable
          @keyup.enter="performSearch"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          size="large" 
          @click="performSearch"
          :loading="searching"
          class="search-btn"
        >
          <el-icon><Search /></el-icon>
          智能搜索
        </el-button>
      </div>

      <!-- 高级筛选器 -->
      <div class="advanced-filters">
        <el-collapse v-model="activeFilters">
          <el-collapse-item title="高级筛选" name="filters">
            <div class="filters-grid">
              <div class="filter-group">
                <label class="filter-label">资源类型</label>
                <el-checkbox-group v-model="filters.resourceTypes">
                  <el-checkbox label="materials">学习资料</el-checkbox>
                  <el-checkbox label="code">代码片段</el-checkbox>
                  <el-checkbox label="video">视频教程</el-checkbox>
                  <el-checkbox label="documentation">技术文档</el-checkbox>
                </el-checkbox-group>
              </div>

              <div class="filter-group">
                <label class="filter-label">学习难度</label>
                <el-radio-group v-model="filters.difficulty">
                  <el-radio label="">全部</el-radio>
                  <el-radio label="beginner">入门</el-radio>
                  <el-radio label="intermediate">进阶</el-radio>
                  <el-radio label="advanced">精通</el-radio>
                </el-radio-group>
              </div>

              <div class="filter-group">
                <label class="filter-label">更新时间</label>
                <el-select v-model="filters.timeRange" placeholder="选择时间范围">
                  <el-option label="全部时间" value="" />
                  <el-option label="最近一周" value="week" />
                  <el-option label="最近一月" value="month" />
                  <el-option label="最近三月" value="quarter" />
                  <el-option label="最近一年" value="year" />
                </el-select>
              </div>

              <div class="filter-group">
                <label class="filter-label">社区评分</label>
                <el-select v-model="filters.minRating" placeholder="最低评分">
                  <el-option label="全部评分" value="" />
                  <el-option label="4星及以上" :value="4" />
                  <el-option label="3星及以上" :value="3" />
                  <el-option label="2星及以上" :value="2" />
                </el-select>
              </div>

              <div class="filter-group">
                <label class="filter-label">学科关联</label>
                <el-select
                  v-model="filters.subject"
                  multiple
                  placeholder="选择相关学科"
                >
                  <el-option label="计算机科学" value="computer-science" />
                  <el-option label="数学" value="mathematics" />
                  <el-option label="物理学" value="physics" />
                  <el-option label="金融学" value="finance" />
                  <el-option label="生物学" value="biology" />
                </el-select>
              </div>

              <div class="filter-group">
                <label class="filter-label">内容形态</label>
                <el-radio-group v-model="filters.contentFormat">
                  <el-radio label="">全部</el-radio>
                  <el-radio label="theory">理论</el-radio>
                  <el-radio label="practice">实战</el-radio>
                  <el-radio label="case">案例</el-radio>
                </el-radio-group>
              </div>
            </div>

            <div class="filter-actions">
              <el-button @click="resetFilters">重置筛选</el-button>
              <el-button type="primary" @click="applyFilters">应用筛选</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div v-if="hasResults" class="results-section">
      <!-- 搜索统计与排序 -->
      <div class="results-header glass-card">
        <div class="results-stats">
          <span class="total-results">
            找到 <strong>{{ totalResults }}</strong> 个相关结果
          </span>
          <span class="search-time">
            搜索用时 {{ searchTime }}ms
          </span>
        </div>
        <div class="results-sort">
          <span class="sort-label">排序方式：</span>
          <el-select v-model="sortBy" @change="sortResults">
            <el-option label="智能匹配度" value="relevance" />
            <el-option label="资源质量" value="quality" />
            <el-option label="更新时间" value="time" />
            <el-option label="社区评分" value="rating" />
          </el-select>
        </div>
      </div>

      <!-- 搜索意图分析 -->
      <div v-if="searchIntent" class="intent-analysis glass-card">
        <div class="intent-header">
          <el-icon><MagicStick /></el-icon>
          <span>搜索意图识别</span>
        </div>
        <div class="intent-content">
          <p class="intent-description">{{ searchIntent.description }}</p>
          <div class="intent-keywords">
            <span class="intent-label">关键词扩展：</span>
            <el-tag
              v-for="keyword in searchIntent.expandedKeywords"
              :key="keyword"
              size="small"
              type="info"
              class="intent-keyword"
            >
              {{ keyword }}
            </el-tag>
          </div>
          <div class="intent-suggestions">
            <span class="intent-label">相关建议：</span>
            <el-button
              v-for="suggestion in searchIntent.suggestions"
              :key="suggestion"
              size="small"
              text
              @click="searchSuggestion(suggestion)"
            >
              {{ suggestion }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div class="results-list">
        <div 
          v-for="(result, index) in searchResults" 
          :key="result.id"
          class="result-card glass-card"
          :class="{ 'highlighted': index < 3 }"
        >
          <!-- 结果头部 -->
          <div class="result-header">
            <div class="result-title-section">
              <h3 class="result-title" @click="viewResult(result)">
                {{ result.title }}
              </h3>
              <div class="result-meta">
                <el-tag 
                  :type="getResourceTypeTag(result.resourceType)" 
                  size="small"
                  class="resource-type"
                >
                  {{ getResourceTypeLabel(result.resourceType) }}
                </el-tag>
                <el-tag 
                  :type="getDifficultyTag(result.difficulty)" 
                  size="small"
                  class="difficulty"
                >
                  {{ getDifficultyLabel(result.difficulty) }}
                </el-tag>
                <span class="update-time">{{ formatTime(result.updatedAt) }}</span>
              </div>
            </div>
            <div class="result-score">
              <div class="relevance-score">
                <el-progress 
                  :percentage="result.relevanceScore" 
                  :color="getScoreColor(result.relevanceScore)"
                  :show-text="false"
                  class="score-progress"
                />
                <span class="score-text">{{ result.relevanceScore }}%</span>
              </div>
            </div>
          </div>

          <!-- AI生成的核心价值摘要 -->
          <div class="result-summary">
            <div class="summary-header">
              <el-icon><MagicStick /></el-icon>
              <span>AI核心价值摘要</span>
            </div>
            <p class="summary-text">{{ result.aiSummary }}</p>
          </div>

          <!-- 结果内容预览 -->
          <div class="result-preview">
            <p class="preview-text">{{ result.preview }}</p>
            <div v-if="result.codeSnippet" class="code-preview">
              <pre><code>{{ result.codeSnippet }}</code></pre>
            </div>
          </div>

          <!-- 结果底部信息 -->
          <div class="result-footer">
            <div class="result-stats">
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>{{ result.rating }}/5</span>
              </div>
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ result.views }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Download /></el-icon>
                <span>{{ result.downloads }}</span>
              </div>
            </div>
            <div class="result-actions">
              <el-button size="small" @click="previewResult(result)">
                <el-icon><View /></el-icon>
                预览
              </el-button>
              <el-button 
                type="primary" 
                size="small" 
                @click="useResult(result)"
              >
                <el-icon><Check /></el-icon>
                使用
              </el-button>
            </div>
          </div>

          <!-- 相关标签 -->
          <div class="result-tags">
            <el-tag
              v-for="tag in result.tags"
              :key="tag"
              size="mini"
              type="info"
              effect="plain"
              class="result-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMoreResults" class="load-more">
        <el-button @click="loadMoreResults" :loading="loadingMore">
          加载更多结果
        </el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="searched" class="empty-state glass-card">
      <el-icon class="empty-icon"><Search /></el-icon>
      <h3>未找到相关结果</h3>
      <p>尝试调整搜索关键词或筛选条件</p>
      <div class="search-tips">
        <h4>搜索建议：</h4>
        <ul>
          <li>使用更具体的关键词</li>
          <li>检查关键词拼写</li>
          <li>尝试同义词或相关术语</li>
          <li>放宽筛选条件</li>
        </ul>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialog.visible"
      :title="previewDialog.title"
      width="80%"
      top="5vh"
      class="preview-dialog"
    >
      <div class="preview-content">
        <div v-if="previewDialog.loading" class="preview-loading">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>加载中...</p>
        </div>
        <div v-else class="preview-body">
          <!-- 这里可以显示完整的内容预览 -->
          <div class="preview-text">
            <h4>完整内容预览</h4>
            <p>{{ previewDialog.content }}</p>
          </div>
          <div v-if="previewDialog.code" class="preview-code">
            <h4>代码示例</h4>
            <pre><code>{{ previewDialog.code }}</code></pre>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  Search, View, Check, Star, Download, Loading, MagicStick
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

type ResourceType = 'materials' | 'code' | 'video' | 'documentation'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
interface SearchIntent { description: string; expandedKeywords: string[]; suggestions: string[] }
interface SearchResult {
  id: string
  title: string
  resourceType: ResourceType
  difficulty: Difficulty
  updatedAt: Date
  aiSummary: string
  preview: string
  codeSnippet: string
  rating: number
  views: number
  downloads: number
  tags: string[]
  relevanceScore: number
}
interface Filters {
  resourceTypes: ResourceType[]
  difficulty: Difficulty | ''
  timeRange: string
  minRating: number | ''
  subject: string[]
  contentFormat: '' | 'theory' | 'practice' | 'case'
}

// 搜索相关
const searchQuery = ref('')
const searching = ref(false)
const searched = ref(false)
const searchTime = ref(0)

// 筛选相关
const activeFilters = ref<string[]>([])
const filters = reactive<Filters>({
  resourceTypes: ['materials', 'code'],
  difficulty: '',
  timeRange: '',
  minRating: '',
  subject: [],
  contentFormat: ''
})

// 排序相关
const sortBy = ref('relevance')

// 搜索结果
const searchResults = ref<SearchResult[]>([])
const totalResults = ref(0)
const hasMoreResults = ref(true)
const loadingMore = ref(false)

// 搜索意图分析
const searchIntent = ref<SearchIntent | null>(null)

// 预览对话框
const previewDialog = reactive({
  visible: false,
  title: '',
  content: '',
  code: '',
  loading: false
})

// 计算属性
const hasResults = computed(() => searchResults.value.length > 0)

// 模拟搜索数据
const mockResults: Omit<SearchResult, 'id'>[] = [
  {
    title: 'Python机器学习入门完整教程',
    resourceType: 'materials',
    difficulty: 'beginner',
    updatedAt: new Date('2025-11-15'),
    aiSummary: '本教程从基础概念开始，循序渐进地介绍机器学习的核心算法，包含大量实例代码和实践项目，特别适合编程基础薄弱的初学者。',
    preview: '机器学习是人工智能的一个重要分支，它使计算机能够在没有明确编程的情况下学习和改进。本教程将带你从零开始...',
    codeSnippet: 'from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression',
    rating: 4.8,
    views: 1250,
    downloads: 340,
    tags: ['python', 'machine-learning', 'tutorial', 'beginner'],
    relevanceScore: 95
  },
  {
    title: 'Vue 3组合式API最佳实践代码模板',
    resourceType: 'code',
    difficulty: 'intermediate',
    updatedAt: new Date('2025-11-14'),
    aiSummary: '提供了Vue 3组合式API的完整项目模板，包含状态管理、组件通信、生命周期等核心概念的最佳实践实现。',
    preview: 'Vue 3的组合式API为组件逻辑复用提供了更灵活的方案。本模板展示了如何在实际项目中正确使用setup函数...',
    codeSnippet: 'import { ref, computed, onMounted } from \'vue\'\n\nexport default {\n  setup() {\n    const count = ref(0)',
    rating: 4.6,
    views: 890,
    downloads: 220,
    tags: ['vue3', 'composition-api', 'template', 'best-practices'],
    relevanceScore: 88
  },
  {
    title: 'Docker容器化部署完整指南',
    resourceType: 'documentation',
    difficulty: 'advanced',
    updatedAt: new Date('2025-11-13'),
    aiSummary: '深度解析Docker容器化技术，从基础概念到生产环境部署，包含性能优化和安全配置的高级技巧。',
    preview: 'Docker作为现代应用部署的标准工具，掌握其核心概念和使用方法对每个开发者都至关重要。本指南...',
    codeSnippet: 'FROM node:16-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install',
    rating: 4.9,
    views: 2100,
    downloads: 560,
    tags: ['docker', 'deployment', 'containerization', 'devops'],
    relevanceScore: 82
  }
]

// 搜索方法
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  searching.value = true
  const startTime = Date.now()
  
  // 模拟搜索延迟
  setTimeout(() => {
    searchTime.value = Date.now() - startTime
    
    // 分析搜索意图
    analyzeSearchIntent()
    
    // 生成搜索结果
    generateSearchResults()
    
    searching.value = false
    searched.value = true
    
    ElMessage.success(`搜索完成，找到 ${searchResults.value.length} 个结果`)
  }, 1500)
}

const analyzeSearchIntent = () => {
  const query = searchQuery.value.toLowerCase()
  
  // 简单的意图分析逻辑
  let intent: SearchIntent = {
    description: '',
    expandedKeywords: [],
    suggestions: []
  }
  
  if (query.includes('机器学习') || query.includes('machine learning')) {
    intent.description = '用户正在寻找机器学习相关的学习资源和代码实现'
    intent.expandedKeywords = ['深度学习', '神经网络', '数据挖掘', '算法', 'Python']
    intent.suggestions = ['机器学习算法详解', '深度学习框架对比', '数据预处理技巧']
  } else if (query.includes('vue') || query.includes('前端')) {
    intent.description = '用户需要前端开发相关的教程和代码模板'
    intent.expandedKeywords = ['Vue.js', 'React', 'JavaScript', '组件开发', '响应式设计']
    intent.suggestions = ['Vue 3新特性详解', '前端性能优化', '组件库设计原则']
  } else if (query.includes('docker') || query.includes('部署')) {
    intent.description = '用户想了解容器化技术和部署方案'
    intent.expandedKeywords = ['容器化', 'Kubernetes', 'CI/CD', '微服务', '云原生']
    intent.suggestions = ['Kubernetes入门指南', 'Docker最佳实践', '微服务架构设计']
  } else {
    intent.description = '用户正在寻找相关的学习资源'
    intent.expandedKeywords = ['教程', '文档', '代码', '实践']
    intent.suggestions = ['相关技术栈介绍', '入门教程推荐', '实战项目案例']
  }
  
  searchIntent.value = intent
}

const generateSearchResults = () => {
  // 模拟搜索结果生成
  const results = mockResults.map(result => ({
    ...result,
    id: Math.random().toString(36).substr(2, 9)
  }))
  
  searchResults.value = results
  totalResults.value = results.length
}

const sortResults = () => {
  // 模拟排序逻辑
  ElMessage.success('结果已重新排序')
}

const searchSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  performSearch()
}

const viewResult = (result: SearchResult) => {
  ElMessage.info(`查看详情: ${result.title}`)
}

const previewResult = (result: SearchResult) => {
  previewDialog.visible = true
  previewDialog.title = result.title
  previewDialog.loading = true
  previewDialog.content = result.preview
  previewDialog.code = result.codeSnippet
  
  setTimeout(() => {
    previewDialog.loading = false
  }, 1000)
}

const useResult = (result: SearchResult) => {
  ElMessage.success(`已选择使用: ${result.title}`)
}

const loadMoreResults = () => {
  loadingMore.value = true
  
  setTimeout(() => {
    // 模拟加载更多结果
    hasMoreResults.value = false
    loadingMore.value = false
    ElMessage.info('已加载所有结果')
  }, 1000)
}

const applyFilters = () => {
  ElMessage.success('筛选条件已应用')
  if (searchQuery.value) {
    performSearch()
  }
}

const resetFilters = () => {
  Object.assign(filters, {
    resourceTypes: ['materials', 'code'],
    difficulty: '',
    timeRange: '',
    minRating: '',
    subject: [],
    contentFormat: ''
  })
  ElMessage.success('筛选条件已重置')
}

const getResourceTypeTag = (type: ResourceType) => {
  const tags = {
    materials: 'success',
    code: 'primary',
    video: 'warning',
    documentation: 'info'
  } as const
  type Key = keyof typeof tags
  return tags[type as Key] || 'info'
}

const getResourceTypeLabel = (type: ResourceType) => {
  const labels = {
    materials: '学习资料',
    code: '代码片段',
    video: '视频教程',
    documentation: '技术文档'
  } as const
  type Key = keyof typeof labels
  return labels[type as Key] || '其他'
}

const getDifficultyTag = (difficulty: Difficulty) => {
  const tags = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  } as const
  type Key = keyof typeof tags
  return tags[difficulty as Key] || 'info'
}

const getDifficultyLabel = (difficulty: Difficulty) => {
  const labels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '精通'
  } as const
  type Key = keyof typeof labels
  return labels[difficulty as Key] || '未知'
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#409EFF'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString()
}

onMounted(() => {
  ElMessage.success('智能搜索引擎已加载')
})
</script>

<style scoped>
.advanced-search-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--app-bg);
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

.glass-card {
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.search-section {
  margin-bottom: 24px;
}

.search-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
}

.search-btn {
  min-width: 120px;
}

.advanced-filters {
  margin-top: 20px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-stats {
  display: flex;
  gap: 20px;
  align-items: center;
}

.total-results {
  color: #2c3e50;
  font-size: 1.1rem;
}

.search-time {
  color: #909399;
  font-size: 0.9rem;
}

.results-sort {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  color: #606266;
  font-size: 0.9rem;
}

.intent-analysis {
  margin-bottom: 20px;
}

.intent-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #e6a23c;
  font-weight: 600;
}

.intent-content {
  padding-left: 28px;
}

.intent-description {
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.6;
}

.intent-keywords,
.intent-suggestions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.intent-label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 80px;
}

.intent-keyword {
  margin: 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-card {
  transition: all 0.3s ease;
}

.result-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.result-card.highlighted {
  border-left: 4px solid #409EFF;
  background: rgba(64, 158, 255, 0.05);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.result-title {
  color: #409EFF;
  margin: 0 0 8px 0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.result-title:hover {
  color: #66b1ff;
}

.result-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.resource-type,
.difficulty {
  margin: 0;
}

.update-time {
  color: #909399;
  font-size: 0.8rem;
}

.result-score {
  text-align: center;
}

.relevance-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-progress {
  width: 60px;
}

.score-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
}

.result-summary {
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border-left: 3px solid #409EFF;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #409EFF;
  font-weight: 600;
  font-size: 0.9rem;
}

.summary-text {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.result-preview {
  margin-bottom: 16px;
}

.preview-text {
  color: #606266;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.code-preview {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
}

.code-preview pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 0.8rem;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.result-tag {
  margin: 0;
}

.load-more {
  text-align: center;
  margin-top: 32px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state h3 {
  color: #606266;
  margin-bottom: 8px;
}

.empty-state p {
  color: #909399;
  margin: 0 0 20px 0;
}

.search-tips {
  text-align: left;
  display: inline-block;
}

.search-tips h4 {
  color: #606266;
  margin-bottom: 12px;
}

.search-tips ul {
  margin: 0;
  padding-left: 20px;
}

.search-tips li {
  color: #909399;
  margin-bottom: 4px;
}

.preview-dialog {
  max-height: 80vh;
}

.preview-content {
  min-height: 300px;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.loading-icon {
  font-size: 32px;
  margin-bottom: 16px;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.preview-body {
  padding: 20px 0;
}

.preview-text h4,
.preview-code h4 {
  color: #2c3e50;
  margin-bottom: 12px;
}

.preview-code pre {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
  }
  
  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .result-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .result-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .advanced-search-container {
    padding: 16px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>