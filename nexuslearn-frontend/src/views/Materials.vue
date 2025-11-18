<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>📚 学习资料智能管理</span>
          <el-button type="primary" @click="showUploadDialog = true">上传资料</el-button>
        </div>
      </template>
      
      <!-- 搜索和筛选 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="12">
          <el-input
            v-model="searchQuery"
            placeholder="搜索学习资料..."
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="filters.subject" placeholder="学科筛选" clearable style="width: 150px">
            <el-option label="计算机" value="计算机" />
            <el-option label="数学" value="数学" />
            <el-option label="通用" value="通用" />
          </el-select>
          <el-select v-model="filters.density" placeholder="难度筛选" clearable style="width: 150px; margin-left: 10px">
            <el-option label="入门" value="入门" />
            <el-option label="进阶" value="进阶" />
            <el-option label="精通" value="精通" />
          </el-select>
        </el-col>
      </el-row>

      <!-- 资料列表 -->
      <el-table :data="materials" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="url" label="来源" show-overflow-tooltip>
          <template #default="scope">
            <el-link :href="scope.row.url" target="_blank" v-if="scope.row.url">
              {{ scope.row.url }}
            </el-link>
            <span v-else>{{ scope.row.filename || '本地文件' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tags.subject" label="学科" width="100">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.tags?.subject || '通用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags.density" label="难度" width="100">
          <template #default="scope">
            <el-tag :type="getDensityType(scope.row.tags?.density)" size="small">
              {{ scope.row.tags?.density || '入门' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="qualityScore" label="质量评分" width="120">
          <template #default="scope">
            <el-rate
              v-model="scope.row.qualityScore"
              disabled
              show-score
              score-template="{value}"
              :max="1"
              :step="0.1"
            />
          </template>
        </el-table-column>
        <el-table-column prop="aiProcessing" label="AI处理" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.aiProcessing ? 'success' : 'info'" size="small">
              {{ scope.row.aiProcessing ? '已处理' : '基础' }}
            </el-tag>
            <el-button 
              v-if="scope.row.aiProcessing" 
              type="text" 
              size="small" 
              @click="showAIAnalysis(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewMaterial(scope.row)">查看</el-button>
            <el-button type="warning" size="small" @click="reprocessMaterial(scope.row)">重新处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 上传对话框 -->
    <el-dialog v-model="showUploadDialog" title="上传学习资料" width="600px">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="上传方式">
          <el-radio-group v-model="uploadForm.method">
            <el-radio label="url">URL链接</el-radio>
            <el-radio label="file">本地文件</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="URL地址" v-if="uploadForm.method === 'url'">
          <el-input v-model="uploadForm.url" placeholder="请输入学习资料链接" />
        </el-form-item>
        
        <el-form-item label="选择文件" v-if="uploadForm.method === 'file'">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="true"
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持文本、PDF、图片格式</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="AI处理">
          <el-checkbox v-model="uploadForm.enableAI">启用AI智能处理</el-checkbox>
          <div class="ai-options" v-if="uploadForm.enableAI">
            <el-checkbox v-model="uploadForm.translate">自动翻译</el-checkbox>
            <el-select v-model="uploadForm.targetLang" size="small" style="width: 100px; margin-left: 10px">
              <el-option label="中文" value="zh-CN" />
              <el-option label="英文" value="en" />
              <el-option label="日文" value="ja" />
            </el-select>
          </div>
        </el-form-item>
        
        <el-form-item label="预设标签">
          <el-select v-model="uploadForm.tags.subject" placeholder="学科" size="small">
            <el-option label="计算机" value="计算机" />
            <el-option label="数学" value="数学" />
            <el-option label="物理" value="物理" />
            <el-option label="通用" value="通用" />
          </el-select>
          <el-select v-model="uploadForm.tags.density" placeholder="难度" size="small" style="margin-left: 10px">
            <el-option label="入门" value="入门" />
            <el-option label="进阶" value="进阶" />
            <el-option label="精通" value="精通" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showUploadDialog = false">取消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="uploadLoading">开始处理</el-button>
      </template>
    </el-dialog>

    <!-- AI分析详情对话框 -->
    <el-dialog v-model="showAIDialog" title="AI处理分析" width="700px">
      <div v-if="currentAIAnalysis">
        <el-card>
          <template #header>处理步骤</template>
          <el-timeline>
            <el-timeline-item 
              v-for="step in currentAIAnalysis.steps" 
              :key="step.step"
              :timestamp="`${step.duration}ms`"
              :type="step.result.success !== false ? 'success' : 'danger'"
            >
              {{ step.step }}
              <div v-if="step.result.text" style="margin-top: 5px; font-size: 12px; color: #666;">
                {{ step.result.text?.substring(0, 100) }}...
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
        
        <el-card style="margin-top: 20px;" v-if="currentAIAnalysis.knowledgeGraph">
          <template #header>知识图谱关联</template>
          <el-row :gutter="20">
            <el-col :span="12">
              <h4>相关知识点</h4>
              <el-tag 
                v-for="node in currentAIAnalysis.knowledgeGraph.nodes" 
                :key="node.id"
                style="margin: 5px;"
                :type="node.relevance > 0.8 ? 'success' : 'info'"
              >
                {{ node.name }} ({{ (node.relevance * 100).toFixed(0) }}%)
              </el-tag>
            </el-col>
            <el-col :span="12">
              <h4>学习建议</h4>
              <el-alert 
                v-for="(rec, index) in currentAIAnalysis.knowledgeGraph.recommendations" 
                :key="index"
                :title="rec"
                type="info"
                :closable="false"
                style="margin-bottom: 10px;"
              />
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

interface Material {
  id: string
  url?: string
  filename?: string
  tags: {
    subject: string
    density: string
    [key: string]: any
  }
  qualityScore: number
  aiProcessing?: any
  [key: string]: any
}

const materials = ref<Material[]>([])
const loading = ref(false)
const searchQuery = ref('')
const filters = reactive({
  subject: '',
  density: ''
})

const showUploadDialog = ref(false)
const uploadLoading = ref(false)
const uploadForm = reactive({
  method: 'url',
  url: '',
  file: null as File | null,
  enableAI: true,
  translate: false,
  targetLang: 'zh-CN',
  tags: {
    subject: '通用',
    density: '入门'
  }
})

const showAIDialog = ref(false)
const currentAIAnalysis = ref<any>(null)

const getDensityType = (density: string) => {
  switch (density) {
    case '入门': return 'success'
    case '进阶': return 'warning'
    case '精通': return 'danger'
    default: return 'info'
  }
}

const loadMaterials = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/materials')
    const data = await response.json()
    materials.value = data.items || []
  } catch (error) {
    ElMessage.error('加载资料失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 实现搜索逻辑
  loadMaterials()
}

const handleFileChange = (uploadFile: any) => {
  uploadForm.file = uploadFile.raw
}

const submitUpload = async () => {
  uploadLoading.value = true
  try {
    if (uploadForm.method === 'url' && uploadForm.url) {
      // URL上传
      const response = await fetch('http://localhost:8080/ingest/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadForm.url,
          tags: uploadForm.tags,
          translate: uploadForm.enableAI && uploadForm.translate,
          targetLang: uploadForm.targetLang
        })
      })
      
      if (!response.ok) throw new Error('上传失败')
      ElMessage.success('URL资料处理完成')
    } else if (uploadForm.method === 'file' && uploadForm.file) {
      // 文件上传
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Content = (e.target?.result as string).split(',')[1]
        const response = await fetch('http://localhost:8080/ingest/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: uploadForm.file?.name,
            contentBase64: base64Content,
            tags: uploadForm.tags,
            translate: uploadForm.enableAI && uploadForm.translate,
            targetLang: uploadForm.targetLang
          })
        })
        
        if (!response.ok) throw new Error('上传失败')
        ElMessage.success('文件资料处理完成')
        loadMaterials()
      }
      reader.readAsDataURL(uploadForm.file)
    }
    
    showUploadDialog.value = false
    loadMaterials()
  } catch (error) {
    ElMessage.error('上传失败: ' + (error as Error).message)
  } finally {
    uploadLoading.value = false
  }
}

const viewMaterial = (material: Material) => {
  ElMessageBox.alert(
    `<div>
      <p><strong>ID:</strong> ${material.id}</p>
      <p><strong>来源:</strong> ${material.url || material.filename || '未知'}</p>
      <p><strong>学科:</strong> ${material.tags?.subject || '通用'}</p>
      <p><strong>难度:</strong> ${material.tags?.density || '入门'}</p>
      <p><strong>质量评分:</strong> ${(material.qualityScore * 100).toFixed(0)}分</p>
      <p><strong>AI处理:</strong> ${material.aiProcessing ? '已完成' : '基础处理'}</p>
    </div>`,
    '资料详情',
    { dangerouslyUseHTMLString: true }
  )
}

const showAIAnalysis = (material: Material) => {
  currentAIAnalysis.value = material.aiProcessing
  showAIDialog.value = true
}

const reprocessMaterial = async (_material: Material) => {
  try {
    ElMessage.info('重新处理功能开发中...')
  } catch (error) {
    ElMessage.error('重新处理失败')
  }
}

onMounted(() => {
  loadMaterials()
})
</script>

<style scoped>
.ai-options {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>