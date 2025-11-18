<template>
  <div class="progress-container">
    <el-card class="progress-card">
      <template #header>
        <div class="card-header">
          <h2>模块完成度评估</h2>
          <p class="card-subtitle">系统模块功能验证与状态监控</p>
        </div>
      </template>
      
      <el-row :gutter="24">
        <el-col :span="14">
          <div class="module-list">
            <div 
              v-for="(module, key) in modules" 
              :key="key"
              class="module-item"
              :class="{ 'is-completed': state[key] }"
            >
              <div class="module-info">
                <div class="module-header">
                  <h4 class="module-title">{{ module.title }}</h4>
                  <el-tag 
                    :type="state[key] ? 'success' : 'warning'"
                    size="small"
                    class="status-tag"
                  >
                    {{ state[key] ? '可用' : '待验证' }}
                  </el-tag>
                </div>
                <p class="module-desc">{{ module.description }}</p>
              </div>
              <div class="module-action">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="module.test"
                  :loading="loading[key]"
                  class="test-btn"
                >
                  <el-icon><Check /></el-icon>
                  {{ module.actionText }}
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        
        <el-col :span="10">
          <el-card class="result-card" shadow="never">
            <template #header>
              <div class="result-header">
                <el-icon><DataAnalysis /></el-icon>
                <span>测试结果</span>
                <el-button 
                  v-if="out" 
                  type="text" 
                  size="small"
                  @click="clearOutput"
                  class="clear-btn"
                >
                  清空
                </el-button>
              </div>
            </template>
            <div class="result-content">
              <pre v-if="out" class="result-pre">{{ out }}</pre>
              <div v-else class="empty-result">
                <el-icon><Document /></el-icon>
                <p>点击模块测试按钮查看详细结果</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 整体进度统计 -->
      <div class="overall-progress">
        <div class="progress-header">
          <h3>整体完成度</h3>
          <span class="progress-percent">{{ completionRate }}%</span>
        </div>
        <el-progress 
          :percentage="completionRate" 
          :stroke-width="8"
          :color="progressColor"
          class="progress-bar"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { safeFetchJson, withParams } from '../utils/http'
import { ElMessage } from 'element-plus'
import { Check, DataAnalysis, Document } from '@element-plus/icons-vue'

const out = ref('')
const loading = reactive({ lms: false, materials: false, aiProcessing: false, search: false, collab: false, gov: false, decompose: false, metrics: false })
const state = reactive({ lms: false, materials: false, aiProcessing: false, search: false, collab: false, gov: false, decompose: false, metrics: false })

const modules = {
  lms: {
    title: '学习管理(LMS)',
    description: '个性化学习目标设定与AI驱动的学习计划生成',
    actionText: '一键验证',
    test: testLms
  },
  materials: {
    title: '知识仓库(摄取/IPFS/ES)',
    description: '内容摄取、IPFS存储与Elasticsearch索引集成',
    actionText: '录入并索引',
    test: testIngest
  },
  aiProcessing: {
    title: 'AI内容处理(OCR/翻译/审核)',
    description: '智能内容识别、多语言翻译与质量审核',
    actionText: 'AI处理测试',
    test: testAIProcessing
  },
  search: {
    title: '搜索融合',
    description: '多源数据融合搜索与智能推荐',
    actionText: '搜索验证',
    test: testSearch
  },
  collab: {
    title: '协作闭环(USDC Escrow/NFT/NEXL)',
    description: '智能合约托管、NFT认证与代币激励',
    actionText: '模拟验收',
    test: testCollab
  },
  gov: {
    title: '治理(提案/投票)',
    description: '去中心化治理提案与社区投票',
    actionText: '事件加载',
    test: testGov
  },
  decompose: {
    title: 'AI需求拆解',
    description: '智能需求分析与任务自动拆解',
    actionText: '生成子任务',
    test: testDecompose
  },
  metrics: {
    title: '性能指标(P50/P95/P99)',
    description: '系统性能监控与关键指标分析',
    actionText: '查看指标',
    test: testMetrics
  }
}

const completionRate = computed(() => {
  const completed = Object.values(state).filter(Boolean).length
  return Math.round((completed / Object.keys(state).length) * 100)
})

const progressColor = computed(() => {
  const rate = completionRate.value
  if (rate >= 80) return '#67C23A'
  if (rate >= 60) return '#E6A23C'
  return '#F56C6C'
})

const clearOutput = () => {
  out.value = ''
}

async function testLms() {
  loading.lms = true
  try {
    const g = await safeFetchJson('http://localhost:8080/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'u-progress', goal: '评估演示', skills: ['A','B'] }) }, {})
    const p = await safeFetchJson('http://localhost:8080/plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'u-progress', timeBudgetDays: 3 }) }, { schedule: [] })
    state.lms = Array.isArray(p.schedule) && p.schedule.length > 0
    out.value = JSON.stringify({ goals: g, plans: p }, null, 2)
    ElMessage.success('LMS验证完成')
  } catch { ElMessage.error('失败') }
  finally { loading.lms = false }
}

async function testIngest() {
  loading.materials = true
  try {
    const r = await safeFetchJson('http://localhost:8080/ingest/url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: 'https://example.com/demo', tags: { density: '进阶', subject: '演示', form: '理论' } }) }, { ipfsHash: '' })
    const list = await safeFetchJson('http://localhost:8080/materials', undefined, { items: [] })
    state.materials = !!r.ipfsHash && (list.items?.length || 0) > 0
    out.value = JSON.stringify({ ingest: r, list }, null, 2)
    ElMessage.success('知识仓库验证完成')
  } catch { ElMessage.error('失败') }
  finally { loading.materials = false }
}

async function testSearch() {
  loading.search = true
  try {
    const url = withParams('http://localhost:8080/search', { q: '演示', userId: 'u-progress', filters: { subject: '演示' } })
    const r = await safeFetchJson(url, undefined, { results: [] })
    state.search = Array.isArray(r.results) && r.results.length > 0
    out.value = JSON.stringify(r, null, 2)
    ElMessage.success('搜索验证完成')
  } catch { ElMessage.error('失败') }
  finally { loading.search = false }
}

async function testCollab() {
  loading.collab = true
  try {
    const dm = await safeFetchJson('http://localhost:8080/demands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: '评估需求', description: '演示', techStack: ['Vue3'], budgetStablecoin: 10 }) }, { demand: { id: 0 } })
    const ac = await safeFetchJson('http://localhost:8080/accept', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ demandId: dm.demand.id, contributions: [{ address: '0xabc', share: 1.0 }], contentHash: 'ipfs://QmDemo', summary: '演示方案' }) }, { accepted: false })
    const nf = await safeFetchJson('http://localhost:8080/nfts', undefined, { items: [] })
    state.collab = ac.accepted === true && (nf.items?.length || 0) > 0
    out.value = JSON.stringify({ demand: dm, accept: ac, nfts: nf }, null, 2)
    ElMessage.success('协作闭环验证完成')
  } catch { ElMessage.error('失败') }
  finally { loading.collab = false }
}

async function testGov() {
  loading.gov = true
  try {
    const r = await safeFetchJson('http://localhost:8080/governance/proposals', undefined, { items: [] })
    state.gov = Array.isArray(r.items)
    out.value = JSON.stringify(r, null, 2)
    ElMessage.success('治理事件加载完成')
  } catch { ElMessage.error('失败') }
  finally { loading.gov = false }
}

async function testDecompose() {
  loading.decompose = true
  try {
    const r = await safeFetchJson('http://localhost:8080/ai/decompose', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: '需要前端与合约交互的登录功能' }) }, { tasks: [] })
    state.decompose = Array.isArray(r.tasks) && r.tasks.length > 0
    out.value = JSON.stringify(r, null, 2)
    ElMessage.success('需求拆解生成完成')
  } catch { ElMessage.error('失败') }
  finally { loading.decompose = false }
}

async function testAIProcessing() {
  try {
    // 测试URL内容的AI处理
    const ingestResult = await safeFetchJson('http://localhost:8080/ingest/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com/ai-demo',
        tags: { density: '进阶', subject: 'AI技术', form: '理论' },
        translate: false
      })
    }, { id: 0 })
    
    // 获取详细的AI处理信息
    const aiDetails = await safeFetchJson(`http://localhost:8080/materials/${ingestResult.id}?details=ai`, undefined, { aiAnalysis: { steps: [] } })
    
    state.aiProcessing = !!aiDetails.aiAnalysis && aiDetails.aiAnalysis.steps.length > 0
    out.value = JSON.stringify({ ingest: ingestResult, aiAnalysis: aiDetails.aiAnalysis }, null, 2)
    ElMessage.success('AI处理验证完成')
  } catch (error: any) {
    ElMessage.error('失败: ' + (error?.message || '未知错误'))
  }
}

async function testMetrics() {
  loading.metrics = true
  try {
    const r = await safeFetchJson('http://localhost:8080/metrics', undefined, { p95: 0 })
    state.metrics = !!r.p95
    out.value = JSON.stringify(r, null, 2)
    ElMessage.success('性能指标加载完成')
  } catch { ElMessage.error('失败') }
  finally { loading.metrics = false }
}
</script>

<style scoped>
.progress-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--app-bg);
}

.progress-card {
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  border-radius: 16px;
  box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  border: 1px solid var(--border-color);
}

.card-header {
  text-align: center;
  padding: 8px 0;
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
}

.card-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: var(--card-bg-strong);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.module-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.module-item.is-completed {
  background: rgba(103, 194, 58, 0.08);
  border-color: rgba(103, 194, 58, 0.3);
}

.module-info {
  flex: 1;
  margin-right: 16px;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.module-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 500;
}

.status-tag {
  font-weight: 500;
}

.module-desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.module-action {
  flex-shrink: 0;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-weight: 500;
}

.result-card {
  background: var(--card-bg-strong);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  height: fit-content;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.clear-btn {
  margin-left: auto;
  color: var(--text-tertiary);
}

.result-content {
  min-height: 300px;
}

.result-pre {
  margin: 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-result .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.overall-progress {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 500;
}

.progress-percent {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.progress-bar {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .progress-container {
    padding: 16px;
  }
  
  .module-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .module-info {
    margin-right: 0;
  }
  
  .module-action {
    align-self: flex-end;
  }
}
</style>

