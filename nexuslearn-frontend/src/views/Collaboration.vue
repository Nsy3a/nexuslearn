<template>
  <div class="collaboration-container borderless-container">
    <!-- 动态背景装饰 -->
    <div class="background-ornaments">
      <div class="ornament ornament-1"></div>
      <div class="ornament ornament-2"></div>
      <div class="ornament ornament-3"></div>
    </div>
    
    <!-- 页面标题区域 -->
    <div class="collaboration-header">
      <div class="header-content glass-card">
        <div class="header-text">
          <h1 class="collaboration-title">
            <span class="title-gradient">协作平台</span>
          </h1>
          <p class="collaboration-subtitle">智能协作，共创价值，链上验证</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ store.demands.length }}</div>
            <div class="stat-label">活跃需求</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ store.nfts.length }}</div>
            <div class="stat-label">已铸造NFT</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建需求区域 -->
    <div class="create-demand-section">
      <div class="section-card glass-card">
        <div class="section-header">
          <h3 class="section-title">创建新需求</h3>
          <p class="section-description">发布您的项目需求，吸引全球开发者参与协作</p>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">需求标题</label>
            <input 
              v-model="title" 
              type="text" 
              class="glass-input"
              placeholder="例如：生成前端登录页"
            />
          </div>
          <div class="form-group">
            <label class="form-label">预算 (USDC)</label>
            <input 
              v-model.number="budget" 
              type="number" 
              class="glass-input"
              placeholder="输入预算金额"
              min="1"
            />
          </div>
          <div class="form-group">
            <label class="form-label">技术栈</label>
            <input 
              v-model="techStack" 
              type="text" 
              class="glass-input"
              placeholder="例如：Vue3, TypeScript"
            />
          </div>
          <div class="form-actions">
            <button class="gradient-btn create-btn" @click="onCreateDemand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>创建需求</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 当前需求详情 -->
    <div v-if="currentDemand" class="current-demand-section">
      <div class="section-card glass-card">
        <div class="section-header">
          <h3 class="section-title">{{ currentDemand.title }}</h3>
          <div class="demand-status">
            <div class="status-badge" :class="currentDemand.status.toLowerCase()">
              {{ currentDemand.status }}
            </div>
            <div class="budget-info">
              <span class="budget-amount">{{ currentDemand.budgetStablecoin }} USDC</span>
            </div>
          </div>
        </div>
        
        <!-- 添加任务 -->
        <div class="add-task-section">
          <h4 class="subsection-title">添加任务</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">任务标题</label>
              <input 
                v-model="taskTitle" 
                type="text" 
                class="glass-input"
                placeholder="例如：实现登录表单校验"
              />
            </div>
            <div class="form-group">
              <label class="form-label">技能标签</label>
              <input 
                v-model="taskSkills" 
                type="text" 
                class="glass-input"
                placeholder="例如：Vue3, 表单验证"
              />
            </div>
            <div class="form-actions">
              <button class="gradient-btn add-task-btn" @click="onAddTask">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>添加任务</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 任务表格 -->
        <div v-if="currentDemand.tasks && currentDemand.tasks.length > 0" class="tasks-section">
          <h4 class="subsection-title">任务列表</h4>
          <div class="tasks-table">
            <div class="table-header">
              <div class="header-cell">任务ID</div>
              <div class="header-cell">标题</div>
              <div class="header-cell">技能</div>
              <div class="header-cell">状态</div>
              <div class="header-cell">操作</div>
            </div>
            <div class="table-body">
              <div v-for="task in currentDemand.tasks" :key="task.id" class="table-row">
                <div class="table-cell">{{ task.id }}</div>
                <div class="table-cell title">{{ task.title }}</div>
                <div class="table-cell skills">
                  <span v-for="skill in task.skills" :key="skill" class="skill-tag">
                    {{ skill }}
                  </span>
                </div>
                <div class="table-cell">
                  <div class="status-select">
                    <select 
                      v-model="task.status" 
                      @change="onUpdateTask(task.id, task.status)"
                      class="status-dropdown"
                    >
                      <option value="OPEN">待处理</option>
                      <option value="DOING">进行中</option>
                      <option value="DONE">已完成</option>
                    </select>
                  </div>
                </div>
                <div class="table-cell">
                  <button class="action-btn edit-btn" @click="editTask()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 看板视图 -->
        <div class="kanban-section">
          <h4 class="subsection-title">看板视图</h4>
          <div class="kanban-board">
            <div class="kanban-column">
              <div class="column-header">
                <h5 class="column-title">待处理</h5>
                <div class="column-count">{{ getTasksByStatus('OPEN').length }}</div>
              </div>
              <div class="kanban-col" @dragover.prevent @drop="onDrop('OPEN')">
                <div 
                  v-for="task in getTasksByStatus('OPEN')" 
                  :key="task.id" 
                  class="kanban-item glass-card"
                  draggable="true" 
                  @dragstart="onDragStart(task)"
                >
                  <div class="item-header">
                    <div class="item-title">{{ task.title }}</div>
                    <div class="item-priority" :class="getPriorityClass(task.priority)">
                      {{ task.priority || '普通' }}
                    </div>
                  </div>
                  <div class="item-skills">
                    <span v-for="skill in task.skills" :key="skill" class="skill-badge">
                      {{ skill }}
                    </span>
                  </div>
                  <div class="item-meta">
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ task.assignee || '未分配' }}</span>
                    </div>
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ formatDate(task.dueDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="kanban-column">
              <div class="column-header">
                <h5 class="column-title">进行中</h5>
                <div class="column-count">{{ getTasksByStatus('DOING').length }}</div>
              </div>
              <div class="kanban-col" @dragover.prevent @drop="onDrop('DOING')">
                <div 
                  v-for="task in getTasksByStatus('DOING')" 
                  :key="task.id" 
                  class="kanban-item glass-card"
                  draggable="true" 
                  @dragstart="onDragStart(task)"
                >
                  <div class="item-header">
                    <div class="item-title">{{ task.title }}</div>
                    <div class="item-priority" :class="getPriorityClass(task.priority)">
                      {{ task.priority || '普通' }}
                    </div>
                  </div>
                  <div class="item-skills">
                    <span v-for="skill in task.skills" :key="skill" class="skill-badge">
                      {{ skill }}
                    </span>
                  </div>
                  <div class="item-meta">
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ task.assignee || '未分配' }}</span>
                    </div>
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ formatDate(task.dueDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="kanban-column">
              <div class="column-header">
                <h5 class="column-title">已完成</h5>
                <div class="column-count">{{ getTasksByStatus('DONE').length }}</div>
              </div>
              <div class="kanban-col" @dragover.prevent @drop="onDrop('DONE')">
                <div 
                  v-for="task in getTasksByStatus('DONE')" 
                  :key="task.id" 
                  class="kanban-item glass-card completed"
                  draggable="true" 
                  @dragstart="onDragStart(task)"
                >
                  <div class="item-header">
                    <div class="item-title">{{ task.title }}</div>
                    <div class="completion-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div class="item-skills">
                    <span v-for="skill in task.skills" :key="skill" class="skill-badge">
                      {{ skill }}
                    </span>
                  </div>
                  <div class="item-meta">
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ task.assignee || '未分配' }}</span>
                    </div>
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ formatDate(task.dueDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 提交和验收区域 -->
        <div class="submission-section">
          <div class="submission-grid">
            <div class="submission-card glass-card">
              <h5 class="card-title">提交答案</h5>
              <div class="form-group">
                <label class="form-label">答案URI</label>
                <input 
                  v-model="answerUri" 
                  type="text" 
                  class="glass-input"
                  placeholder="ipfs://Qm123..."
                />
              </div>
              <button class="gradient-btn submit-btn" @click="onSubmitAnswer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>提交答案</span>
              </button>
            </div>
            
            <div class="submission-card glass-card">
              <h5 class="card-title">验收任务</h5>
              <div class="form-group">
                <label class="form-label">内容哈希</label>
                <input 
                  v-model="contentHash" 
                  type="text" 
                  class="glass-input"
                  placeholder="ipfs://QmWork..."
                />
              </div>
              <div class="form-group">
                <label class="form-label">摘要</label>
                <input 
                  v-model="summary" 
                  type="text" 
                  class="glass-input"
                  placeholder="任务完成摘要"
                />
              </div>
              <div class="submission-actions">
                <button class="skeuomorphic-btn accept-btn" @click="onAccept">
                  <span>{{ $t('collaboration.accept') }}</span>
                </button>
                <button class="gradient-btn chain-btn" @click="onAcceptOnChain">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>链上验收</span>
                </button>
              </div>
            </div>
          </div>
          <div class="nft-actions">
            <button class="skeuomorphic-btn list-nft-btn" @click="onListNFTs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ $t('collaboration.nfts') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 需求列表 -->
    <div class="demands-section">
      <div class="section-card glass-card">
        <div class="section-header">
          <h3 class="section-title">需求列表</h3>
          <div class="list-stats">
            <span class="stat-text">总计 {{ store.demands.length }} 个需求</span>
          </div>
        </div>
        <div v-if="store.demands.length > 0" class="demands-list">
          <div 
            v-for="demand in store.demands" 
            :key="demand.id" 
            class="demand-item glass-card"
            @click="store.setCurrentDemand(demand.id)"
          >
            <div class="demand-info">
              <div class="demand-header">
                <h4 class="demand-title">{{ demand.title }}</h4>
                <div class="demand-status-badge" :class="demand.status.toLowerCase()">
                  {{ getStatusLabel(demand.status) }}
                </div>
              </div>
              <div class="demand-meta">
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ formatDate(demand.createdAt) }}</span>
                </div>
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1v6m0 6v6m-8-8h16M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ demand.techStack?.join(', ') }}</span>
                </div>
              </div>
            </div>
            <div class="demand-budget">
              <div class="budget-amount">{{ demand.budgetStablecoin }}</div>
              <div class="budget-unit">USDC</div>
            </div>
            <button class="view-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 14l6-6m0 0l-6-6m6 6H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h4 class="empty-title">暂无需求</h4>
          <p class="empty-description">创建您的第一个需求，开始协作之旅</p>
        </div>
      </div>
    </div>
    
    <!-- NFT列表 -->
    <div v-if="store.nfts.length > 0" class="nfts-section">
      <div class="section-card glass-card">
        <div class="section-header">
          <h3 class="section-title">NFT列表</h3>
          <div class="list-stats">
            <span class="stat-text">总计 {{ store.nfts.length }} 个NFT</span>
          </div>
        </div>
        <div class="nfts-grid">
          <div 
            v-for="nft in store.nfts" 
            :key="nft.nftId" 
            class="nft-item glass-card"
          >
            <div class="nft-header">
              <div class="nft-id">#{{ nft.nftId }}</div>
              <div class="nft-ownership" :class="getOwnershipClass(nft.ownership)">
                {{ nft.ownership }}
              </div>
            </div>
            <div class="nft-content">
              <h5 class="nft-summary">{{ nft.summary }}</h5>
              <div class="nft-hash">
                <span class="hash-label">内容哈希：</span>
                <span class="hash-value">{{ shortenHash(nft.contentHash) }}</span>
              </div>
            </div>
            <div class="nft-footer">
              <div class="nft-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ formatDate(nft.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCollaborationStore } from '../stores/collaboration'
import { useWalletStore } from '../stores/wallet'
import { getSigner, getEscrowContract, getNFTContract, getERC20Contract } from '../lib/chain'
import { ElMessage } from 'element-plus'

const store = useCollaborationStore()
const wallet = useWalletStore()
const title = ref('生成前端登录页')
const budget = ref(100)
const techStack = ref('Vue3,TypeScript')
const answerUri = ref('ipfs://Qm123')
const contentHash = ref('ipfs://QmWork')
const summary = ref('登录方案')
const taskTitle = ref('实现登录表单校验')
const taskSkills = ref('Vue3,表单验证')
const currentDemand = computed(() => store.demands.find(d => d.id === store.currentDemandId))
const draggingTaskId = ref('')

async function onCreateDemand() {
  try {
    await store.createDemand({
      title: title.value,
      description: 'Vue3 方案',
      techStack: techStack.value.split(',').map(s => s.trim()),
      budgetStablecoin: budget.value
    })
    try {
      const signer = await getSigner()
      const usdcAddr = import.meta.env.VITE_USDC_ADDRESS as string
      const escrowAddr = import.meta.env.VITE_ESCROW_ADDRESS as string
      if (!usdcAddr || !escrowAddr) throw new Error('缺少USDC或托管合约地址配置')
      const erc20 = getERC20Contract(usdcAddr, signer)
      let decimals = 6
      try { 
        if (erc20 && typeof erc20.decimals === 'function') {
          decimals = await erc20.decimals() 
        }
      } catch {}
      const amount = BigInt(Math.round(budget.value * Math.pow(10, decimals)))
      if (erc20 && typeof erc20.transfer === 'function') {
        const tx = await erc20.transfer(escrowAddr, amount)
        await tx.wait()
        ElMessage.success('稳定币支付已完成')
      } else {
        throw new Error('ERC20合约初始化失败')
      }
    } catch (e) {
      ElMessage.warning('需求已创建，稳定币支付未完成：请检查链上配置')
    }
    ElMessage.success('需求已创建')
    // 清空表单
    title.value = '生成前端登录页'
    budget.value = 100
    techStack.value = 'Vue3,TypeScript'
  } catch (e) { ElMessage.error('失败') }
}

async function onAddTask() {
  try {
    if (!store.currentDemandId) { ElMessage.error('请先创建需求'); return }
    if (!taskTitle.value.trim()) { ElMessage.error('请输入任务标题'); return }
    await store.addTask(store.currentDemandId, taskTitle.value, taskSkills.value.split(',').map(s => s.trim()))
    taskTitle.value = ''
    taskSkills.value = ''
    ElMessage.success('任务已添加')
  } catch (e) { ElMessage.error('失败') }
}

async function onUpdateTask(taskId: string, status: string) {
  try {
    await store.updateTask(store.currentDemandId, taskId, { status })
    await store.fetchTasks(store.currentDemandId)
    ElMessage.success('任务状态已更新')
  } catch (e) { ElMessage.error('失败') }
}

function onDragStart(task: any) {
  draggingTaskId.value = task.id
}

async function onDrop(toStatus: string) {
  try {
    if (!draggingTaskId.value) return
    const list = (currentDemand.value?.tasks || []).filter(x => x.status === toStatus).sort((a,b)=> (a.pos||0)-(b.pos||0))
    const toIndex = list.length
    await store.reorderTask(store.currentDemandId, draggingTaskId.value, toStatus, toIndex)
    draggingTaskId.value = ''
    ElMessage.success('任务状态已更新')
  } catch (e) { ElMessage.error('失败') }
}

function formatDate(d: any) { 
  if (!d) return '-'
  const date = new Date(d)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

async function onSubmitAnswer() {
  try {
    if (!answerUri.value.trim()) { ElMessage.error('请输入答案URI'); return }
    const addr = wallet.address || '0xabc'
    await store.submitAnswer(store.currentDemandId, addr, answerUri.value, 0.9)
    ElMessage.success('答案已提交')
    answerUri.value = ''
  } catch (e) { ElMessage.error('失败') }
}

async function onAccept() {
  try {
    if (!contentHash.value.trim() || !summary.value.trim()) { 
      ElMessage.error('请填写内容哈希和摘要'); return 
    }
    await store.acceptDemand(
      store.currentDemandId,
      [{ address: '0xabc', share: 1.0 }],
      contentHash.value,
      summary.value
    )
    ElMessage.success('已验收并铸造NFT')
    contentHash.value = ''
    summary.value = ''
  } catch (e) { ElMessage.error('失败') }
}

async function onAcceptOnChain() {
  try {
    const signer = await getSigner()
    const escrowAddr = import.meta.env.VITE_ESCROW_ADDRESS as string
    const nftAddr = import.meta.env.VITE_NFT_ADDRESS as string
    if (!escrowAddr || !nftAddr) throw new Error('缺少合约地址配置')
    const escrow = getEscrowContract(escrowAddr, signer)
    const nft = getNFTContract(nftAddr, signer)
    const contribs = [{ address: '0xabc', share: 1.0 }]
    const contributors = contribs.map(c => c.address)
    const shares = contribs.map(c => Math.round(c.share * 100))
    
    if (escrow && typeof escrow.accept === 'function') {
      await (await escrow.accept(store.currentDemandId, contributors, shares)).wait()
    } else {
      throw new Error('托管合约初始化失败')
    }
    
    if (nft && typeof nft.mintKnowledge === 'function') {
      await (await nft.mintKnowledge(
        await signer.getAddress(),
        contentHash.value,
        summary.value,
        contributors,
        shares,
        store.currentDemandId,
        'https://api.nexuslearn.io/nft/' + store.currentDemandId
      )).wait()
    } else {
      throw new Error('NFT合约初始化失败')
    }
    ElMessage.success('链上验收与NFT已完成')
  } catch (e) { ElMessage.error('失败') }
}

async function onListNFTs() {
  try { await store.listNFTs() } catch (e) { ElMessage.error('失败') }
}

function getPriorityClass(priority?: string) {
  if (!priority) return 'low'
  switch (priority.toLowerCase()) {
    case 'high': return 'high'
    case 'medium': return 'medium'
    case 'low': return 'low'
    default: return 'low'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'OPEN': return '待处理'
    case 'DOING': return '进行中'
    case 'DONE': return '已完成'
    default: return status
  }
}

function getOwnershipClass(ownership: string) {
  switch (ownership) {
    case 'owned': return 'owned'
    case 'creator': return 'creator'
    default: return 'owned'
  }
}

function shortenHash(hash: string) {
  if (!hash || hash.length <= 12) return hash
  return hash.substring(0, 6) + '...' + hash.substring(hash.length - 6)
}

function editTask() {
  // 编辑任务功能，可以打开编辑对话框或跳转到编辑页面
  ElMessage.info('编辑功能开发中')
}

function getTasksByStatus(status: string) {
  return currentDemand.value?.tasks?.filter(task => task.status === status) || []
}
</script>
