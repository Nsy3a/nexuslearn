<template>
  <div class="code-warehouse-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">代码仓库</h1>
      <p class="page-subtitle">可复用代码模块与动态UI生成中心</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 左侧：代码模块库 -->
      <div class="modules-panel glass-card">
        <div class="panel-header">
          <h2>代码模块库</h2>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索代码模块..."
              size="small"
              style="width: 200px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" size="small" @click="showUploadDialog = true">
              <el-icon><Plus /></el-icon>上传模块
            </el-button>
          </div>
        </div>

        <!-- 分类筛选 -->
        <div class="category-filter">
          <el-radio-group v-model="selectedCategory" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="frontend">前端组件</el-radio-button>
            <el-radio-button label="backend">后端API</el-radio-button>
            <el-radio-button label="algorithm">算法实现</el-radio-button>
            <el-radio-button label="cicd">CI/CD脚本</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 模块列表 -->
        <div class="modules-list">
          <div 
            v-for="module in filteredModules" 
            :key="module.id"
            class="module-card"
            :class="{ 'selected': selectedModule?.id === module.id }"
            @click="selectModule(module)"
          >
            <div class="module-header">
              <div class="module-info">
                <h3 class="module-name">{{ module.name }}</h3>
                <p class="module-desc">{{ module.description }}</p>
              </div>
              <div class="module-meta">
                <el-tag size="small" :type="getCategoryType(module.category)">
                  {{ getCategoryLabel(module.category) }}
                </el-tag>
                <div class="quality-score" :class="getQualityClass(module.quality)">
                  <el-icon><Star /></el-icon>
                  <span>{{ module.quality }}/10</span>
                </div>
              </div>
            </div>
            
            <div class="module-stats">
              <div class="stat-item">
                <el-icon><Download /></el-icon>
                <span>{{ module.downloads }}</span>
              </div>
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ module.views }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Clock /></el-icon>
                <span>{{ formatDate(module.updatedAt) }}</span>
              </div>
            </div>

            <div class="module-tags">
              <el-tag
                v-for="tag in module.tags"
                :key="tag"
                size="mini"
                type="info"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="load-more" v-if="hasMoreModules">
          <el-button @click="loadMoreModules" :loading="loadingMore">
            加载更多
          </el-button>
        </div>
      </div>

      <!-- 右侧：代码预览与动态生成 -->
      <div class="preview-panel glass-card">
        <div class="panel-header">
          <h2>{{ selectedModule ? selectedModule.name : '选择一个模块' }}</h2>
          <div class="header-actions" v-if="selectedModule">
            <el-button type="primary" size="small" @click="generateDynamicUI">
              <el-icon><MagicStick /></el-icon>动态生成
            </el-button>
            <el-button size="small" @click="copyCode">
              <el-icon><CopyDocument /></el-icon>复制代码
            </el-button>
          </div>
        </div>

        <!-- 代码预览区域 -->
        <div v-if="selectedModule" class="code-preview">
          <div class="code-header">
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="源代码" name="code">
                <div class="code-content">
                  <pre><code :class="`language-${selectedModule.language}`">{{ selectedModule.code }}</code></pre>
                </div>
              </el-tab-pane>
              <el-tab-pane label="文档" name="docs">
                <div class="docs-content">
                  <div class="doc-section">
                    <h3>功能说明</h3>
                    <p>{{ selectedModule.documentation.purpose }}</p>
                  </div>
                  <div class="doc-section">
                    <h3>使用示例</h3>
                    <pre><code>{{ selectedModule.documentation.usage }}</code></pre>
                  </div>
                  <div class="doc-section">
                    <h3>依赖说明</h3>
                    <div class="dependencies">
                      <el-tag
                        v-for="dep in selectedModule.documentation.dependencies"
                        :key="dep"
                        size="small"
                        type="warning"
                      >
                        {{ dep }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="质量报告" name="quality">
                <div class="quality-report">
                  <div class="quality-metrics">
                    <div class="metric-item">
                      <span class="metric-label">通用性</span>
                      <el-rate 
                        v-model="selectedModule.qualityMetrics.universality" 
                        disabled 
                        show-score
                      />
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">可维护性</span>
                      <el-rate 
                        v-model="selectedModule.qualityMetrics.maintainability" 
                        disabled 
                        show-score
                      />
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">安全性</span>
                      <el-rate 
                        v-model="selectedModule.qualityMetrics.security" 
                        disabled 
                        show-score
                      />
                    </div>
                  </div>
                  <div class="quality-issues" v-if="selectedModule.qualityIssues.length > 0">
                    <h4>质量问题</h4>
                    <el-alert
                      v-for="issue in selectedModule.qualityIssues"
                      :key="issue"
                      :title="issue"
                      type="warning"
                      :closable="false"
                      class="quality-issue"
                    />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <!-- 动态UI生成区域 -->
        <div v-if="showDynamicUI" class="dynamic-ui-section">
          <div class="ui-config">
            <h3>UI生成配置</h3>
            <el-form :model="uiConfig" label-width="100px" size="small">
              <el-form-item label="用户类型">
                <el-radio-group v-model="uiConfig.userType">
                  <el-radio label="beginner">新手模式</el-radio>
                  <el-radio label="developer">开发者模式</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="界面风格">
                <el-select v-model="uiConfig.style" placeholder="选择界面风格">
                  <el-option label="简洁现代" value="modern" />
                  <el-option label="专业详细" value="professional" />
                  <el-option label="卡片式" value="card" />
                </el-select>
              </el-form-item>
              <el-form-item label="交互复杂度">
                <el-slider v-model="uiConfig.complexity" :min="1" :max="10" show-input />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="generateUI" :loading="generatingUI">
              生成界面
            </el-button>
          </div>

          <div v-if="generatedUI" class="generated-ui-preview">
            <h3>生成的界面预览</h3>
            <div class="ui-preview-container" v-html="generatedUI"></div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!selectedModule && !showDynamicUI" class="empty-state">
          <el-icon class="empty-icon"><Document /></el-icon>
          <h3>选择一个代码模块开始</h3>
          <p>浏览左侧的代码模块库，选择一个模块来查看源代码、文档和质量报告</p>
        </div>
      </div>
    </div>

    <!-- 上传模块对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      title="上传代码模块"
      width="600px"
      class="upload-dialog"
    >
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="模块名称" required>
          <el-input v-model="uploadForm.name" placeholder="输入模块名称" />
        </el-form-item>
        <el-form-item label="描述" required>
          <el-input 
            v-model="uploadForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="描述模块功能"
          />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="uploadForm.category" placeholder="选择分类">
            <el-option label="前端组件" value="frontend" />
            <el-option label="后端API" value="backend" />
            <el-option label="算法实现" value="algorithm" />
            <el-option label="CI/CD脚本" value="cicd" />
          </el-select>
        </el-form-item>
        <el-form-item label="编程语言" required>
          <el-select v-model="uploadForm.language" placeholder="选择语言">
            <el-option label="JavaScript" value="javascript" />
            <el-option label="TypeScript" value="typescript" />
            <el-option label="Python" value="python" />
            <el-option label="Vue" value="vue" />
            <el-option label="React" value="react" />
          </el-select>
        </el-form-item>
        <el-form-item label="源代码" required>
          <el-input 
            v-model="uploadForm.code" 
            type="textarea" 
            :rows="10"
            placeholder="粘贴源代码"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="uploadForm.tags"
            multiple
            placeholder="选择相关标签"
            style="width: 100%"
          >
            <el-option label="表单" value="form" />
            <el-option label="表格" value="table" />
            <el-option label="图表" value="chart" />
            <el-option label="按钮" value="button" />
            <el-option label="布局" value="layout" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">取消</el-button>
          <el-button type="primary" @click="uploadModule" :loading="uploading">
            上传模块
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  Search, Plus, Star, Download, View, Clock,
  MagicStick, CopyDocument, Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchQuery = ref('')
const selectedCategory = ref('all')

// 类型定义
type Category = 'frontend' | 'backend' | 'algorithm' | 'cicd'
type Lang = 'javascript' | 'typescript' | 'python' | 'vue' | 'react'
interface Module {
  id: number
  name: string
  description: string
  category: Category
  language: Lang
  code: string
  documentation: { purpose: string; usage: string; dependencies: string[] }
  qualityMetrics: { universality: number; maintainability: number; security: number }
  qualityIssues: string[]
  tags: string[]
  quality: number
  downloads: number
  views: number
  updatedAt: Date
}

// 代码模块数据
const codeModules = ref<Module[]>([
  {
    id: 1,
    name: '智能表单生成器',
    description: '根据数据模型自动生成响应式表单，支持验证和动态字段',
    category: 'frontend',
    language: 'vue',
    quality: 9.2,
    downloads: 1250,
    views: 3420,
    updatedAt: new Date('2025-11-15'),
    tags: ['form', 'generator', 'validation', 'dynamic'],
    code: `// 表单生成器示例代码（简化版）
import { reactive, computed } from 'vue'

const formData = reactive({})
const formFields = computed(() => [])

function getComponentType(type) {
  const componentMap = {
    input: 'el-input',
    select: 'el-select',
    date: 'el-date-picker'
  }
  return componentMap[type] || 'el-input'
}
`,
    documentation: {
      purpose: '自动化表单生成，减少重复代码，提高开发效率',
      usage: '传入数据模型和验证规则，自动生成完整表单',
      dependencies: ['element-plus', 'vue']
    },
    qualityMetrics: {
      universality: 4.5,
      maintainability: 4.8,
      security: 4.2
    },
    qualityIssues: []
  },
  {
    id: 2,
    name: 'API请求封装器',
    description: '统一的API请求封装，支持拦截器、错误处理和重试机制',
    category: 'backend',
    language: 'javascript',
    quality: 8.7,
    downloads: 890,
    views: 2150,
    updatedAt: new Date('2025-11-14'),
    tags: ['api', 'request', 'interceptor', 'error-handling'],
    code: `import axios from 'axios'

class ApiClient {
  constructor(baseURL, options = {}) {
    this.client = axios.create({
      baseURL,
      timeout: options.timeout || 30000,
      ...options
    })
    
    this.setupInterceptors()
  }
  
  setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      config => {
        // 添加认证token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`
        }
        return config
      },
      error => Promise.reject(error)
    )
    
    // 响应拦截器
    this.client.interceptors.response.use(
      response => response.data,
      async error => {
        if (error.response?.status === 401) {
          // 处理认证失败
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }
  
  async request(method, url, data = null, config = {}) {
    try {
      const response = await this.client({
        method,
        url,
        data,
        ...config
      })
      return response
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }
}

export default ApiClient`,
    documentation: {
      purpose: '统一API请求管理，提供完整的错误处理机制',
      usage: '创建ApiClient实例，配置基础URL和选项',
      dependencies: ['axios']
    },
    qualityMetrics: {
      universality: 4.8,
      maintainability: 4.5,
      security: 4.0
    },
    qualityIssues: ['需要添加重试机制']
  }
])

// 选中模块相关
const selectedModule = ref<Module | null>(null)
const activeTab = ref('code')
const showDynamicUI = ref(false)
const generatingUI = ref(false)
const generatedUI = ref('')

// UI生成配置
const uiConfig = reactive({
  userType: 'beginner',
  style: 'modern',
  complexity: 5
})

// 上传相关
const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadForm = reactive<{ name: string; description: string; category: Category; language: Lang; code: string; tags: string[] }>({
  name: '',
  description: '',
  category: 'frontend',
  language: 'javascript',
  code: '',
  tags: []
})

// 加载更多相关
const loadingMore = ref(false)
const hasMoreModules = ref(true)

// 计算属性
const filteredModules = computed(() => {
  let modules = codeModules.value
  
  // 分类筛选
  if (selectedCategory.value !== 'all') {
    modules = modules.filter(m => m.category === selectedCategory.value)
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    modules = modules.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return modules
})

// 方法函数
const selectModule = (module: any) => {
  selectedModule.value = module
  showDynamicUI.value = false
}

const getCategoryType = (category: string) => {
  const types = {
    frontend: 'success',
    backend: 'primary',
    algorithm: 'warning',
    cicd: 'info'
  } as const
  return types[category as keyof typeof types] || 'info'
}

const getCategoryLabel = (category: string) => {
  const labels = {
    frontend: '前端组件',
    backend: '后端API',
    algorithm: '算法实现',
    cicd: 'CI/CD脚本'
  } as const
  return labels[category as keyof typeof labels] || '其他'
}

const getQualityClass = (quality: number) => {
  if (quality >= 9) return 'excellent'
  if (quality >= 8) return 'good'
  if (quality >= 7) return 'average'
  return 'poor'
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

const copyCode = () => {
  if (selectedModule.value) {
    navigator.clipboard.writeText(selectedModule.value.code)
    ElMessage.success('代码已复制到剪贴板')
  }
}

const generateDynamicUI = () => {
  showDynamicUI.value = true
}

import { UI_TEMPLATES } from '../utils/uiTemplates'

const generateUI = async () => {
  generatingUI.value = true
  setTimeout(() => {
    const template = UI_TEMPLATES[uiConfig.userType as 'beginner'|'developer'][uiConfig.style as 'modern'|'professional']
    generatedUI.value = template
    generatingUI.value = false
    ElMessage.success('界面生成成功')
  }, 2000)
}

const uploadModule = () => {
  uploading.value = true
  
  setTimeout(() => {
    const newModule: Module = {
      id: codeModules.value.length + 1,
      name: uploadForm.name,
      description: uploadForm.description,
      category: uploadForm.category,
      language: uploadForm.language,
      quality: 8.0,
      downloads: 0,
      views: 1,
      updatedAt: new Date(),
      tags: uploadForm.tags,
      code: uploadForm.code,
      documentation: {
        purpose: '用户上传的代码模块',
        usage: '根据具体需求使用',
        dependencies: []
      },
      qualityMetrics: {
        universality: 4.0,
        maintainability: 4.0,
        security: 4.0
      },
      qualityIssues: ['需要代码审查']
    }
    
    codeModules.value.unshift(newModule)
    uploading.value = false
    showUploadDialog.value = false
    
    // 重置表单
    Object.assign(uploadForm, {
      name: '',
      description: '',
      category: 'frontend' as Category,
      language: 'javascript' as Lang,
      code: '',
      tags: [] as string[]
    })
    
    ElMessage.success('模块上传成功，等待代码审查')
  }, 1500)
}

const loadMoreModules = () => {
  loadingMore.value = true
  
  setTimeout(() => {
    // 模拟加载更多数据
    hasMoreModules.value = false
    loadingMore.value = false
  }, 1000)
}

onMounted(() => {
  ElMessage.success('代码仓库已加载')
})
</script>

<style scoped>
.code-warehouse-container {
  padding: 24px;
  min-height: 100vh;
  background: radial-gradient(1000px 600px at 20% -10%, rgba(255,255,255,0.35), transparent),
              radial-gradient(800px 500px at 100% 10%, rgba(255,255,255,0.25), transparent),
              linear-gradient(120deg, #eef2f7 0%, #f7f9fc 100%);
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
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: saturate(1.2) blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow:
    0 12px 30px rgba(31, 43, 58, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.35);
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-filter {
  margin-bottom: 20px;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
}

.module-card {
  background: rgba(255, 255, 255, 0.72);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: box-shadow .25s ease, transform .2s ease;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(31, 43, 58, 0.12);
}

.module-card.selected {
  border-color: rgba(64, 158, 255, 0.6);
  background: rgba(64, 158, 255, 0.08);
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.module-info h3 {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.module-info p {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
}

.module-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.quality-score {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 0.9rem;
}

.quality-score.excellent {
  color: #67C23A;
}

.quality-score.good {
  color: #409EFF;
}

.quality-score.average {
  color: #E6A23C;
}

.quality-score.poor {
  color: #F56C6C;
}

.module-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 0.8rem;
}

.module-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.code-preview {
  margin-top: 20px;
}

.code-header {
  margin-bottom: 16px;
}

.code-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.docs-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.doc-section {
  margin-bottom: 20px;
}

.doc-section h3 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.doc-section p {
  color: #606266;
  line-height: 1.6;
}

.dependencies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quality-report {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.quality-metrics {
  margin-bottom: 20px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  font-weight: 600;
  color: #2c3e50;
}

.quality-issues h4 {
  color: #f56c6c;
  margin-bottom: 8px;
}

.quality-issue {
  margin-bottom: 8px;
}

.dynamic-ui-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.ui-config {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.ui-config h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.generated-ui-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.generated-ui-preview h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.ui-preview-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e4e7ed;
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
  margin: 0;
}

.load-more {
  text-align: center;
  margin-top: 24px;
}

/* 生成的UI样式 */
.generated-ui {
  font-family: inherit;
}

.modern-beginner .ui-header {
  text-align: center;
  margin-bottom: 24px;
}

.modern-beginner .ui-header h3 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.modern-beginner .ui-desc {
  color: #909399;
  margin: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  color: #606266;
  font-weight: 500;
}

.simple-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.simple-input:focus {
  outline: none;
  border-color: #409EFF;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #66b1ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .code-warehouse-container {
    padding: 16px;
  }
  
  .glass-card {
    padding: 16px;
  }
  
  .module-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .module-meta {
    align-items: flex-start;
  }
}
</style>