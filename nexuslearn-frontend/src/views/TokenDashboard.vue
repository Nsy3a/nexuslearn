<template>
  <div class="token-dashboard borderless-container">
    <!-- 动态背景装饰 -->
    <div class="background-ornaments">
      <div class="ornament ornament-1"></div>
      <div class="ornament ornament-2"></div>
      <div class="ornament ornament-3"></div>
    </div>
    
    <!-- 页面标题区域 -->
    <div class="dashboard-header">
      <div class="header-content glass-card">
        <div class="header-text">
          <h1 class="dashboard-title">
            <span class="title-gradient">代币仪表板</span>
          </h1>
          <p class="dashboard-subtitle">管理您的数字资产，优化投资策略</p>
        </div>
        <div class="header-actions">
          <button class="gradient-btn refresh-btn" @click="refreshData">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>刷新数据</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 核心数据卡片 -->
    <div class="core-stats-section">
      <div class="stats-grid">
        <div class="stat-card glass-card asset-overview">
          <div class="card-header">
            <h3 class="card-title">资产概览</h3>
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 12L21.5 6.5M12 12V23M12 12L2.5 6.5M21.5 17.5L12 23M2.5 17.5L12 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="balance-content">
            <div class="balance-item">
              <div class="balance-info">
                <span class="balance-label">NEXL 余额</span>
                <span class="balance-value">{{ formatToken(nexlBalance) }}</span>
                <span class="balance-usd">≈ {{ formatUSD(nexlBalance * tokenPrice) }}</span>
              </div>
              <div class="balance-icon">
                <div class="token-icon nexl-icon">N</div>
              </div>
            </div>
            <div class="balance-item">
              <div class="balance-info">
                <span class="balance-label">USDC 余额</span>
                <span class="balance-value">{{ formatToken(usdcBalance) }}</span>
                <span class="balance-usd">≈ {{ formatUSD(usdcBalance) }}</span>
              </div>
              <div class="balance-icon">
                <div class="token-icon usdc-icon">U</div>
              </div>
            </div>
            <div class="balance-divider"></div>
            <div class="balance-total">
              <span class="total-label">总资产价值</span>
              <span class="total-value">{{ formatUSD(totalAssetValue) }}</span>
            </div>
          </div>
        </div>
        
        <div class="stat-card glass-card staking-info">
          <div class="card-header">
            <h3 class="card-title">质押收益</h3>
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.09 8.26L21 9.27L16.5 13.14L17.82 20L12 16.77L6.18 20L7.5 13.14L3 9.27L9.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="staking-content">
            <div class="staking-item">
              <div class="staking-label">质押总额</div>
              <div class="staking-value">{{ formatToken(stakedAmount) }} NEXL</div>
              <div class="staking-progress">
                <div class="progress-bar" :style="{ width: Math.min((stakedAmount / (stakedAmount + nexlBalance)) * 100, 100) + '%' }"></div>
              </div>
            </div>
            <div class="staking-item">
              <div class="staking-label">待领取奖励</div>
              <div class="staking-value reward">{{ formatToken(totalRewards) }} NEXL</div>
              <button class="claim-btn" @click="claimRewards" :disabled="totalRewards <= 0">
                <span>领取</span>
              </button>
            </div>
            <div class="staking-item">
              <div class="staking-label">年化收益率</div>
              <div class="staking-value apr">{{ formatAPR(currentAPR) }}</div>
            </div>
            <div class="staking-actions">
              <button class="skeuomorphic-btn stake-btn" @click="showStakeDialog = true">
                <span>质押更多</span>
              </button>
              <button class="skeuomorphic-btn unstake-btn" @click="showUnstakeDialog = true" :disabled="stakedAmount <= 0">
                <span>解押</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="stat-card glass-card market-data">
          <div class="card-header">
            <h3 class="card-title">市场数据</h3>
            <div class="price-change" :class="priceChangeType">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" v-if="priceChangePercent.startsWith('+')">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" v-else>
                <path d="M17 7L7 17M7 17H17M7 17V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ priceChangePercent }}
            </div>
          </div>
          <div class="market-content">
            <div class="market-item">
              <div class="market-label">NEXL 价格</div>
              <div class="market-value price">${{ formatPrice(tokenPrice) }}</div>
            </div>
            <div class="market-item">
              <div class="market-label">市值排名</div>
              <div class="market-value rank">#{{ Math.floor(Math.random() * 100) + 1 }}</div>
            </div>
            <div class="market-item">
              <div class="market-label">流通供应量</div>
              <div class="market-value supply">{{ formatLargeNumber(circulatingSupply) }} NEXL</div>
            </div>
            <div class="market-item">
              <div class="market-label">总供应量</div>
              <div class="market-value supply">{{ formatLargeNumber(totalSupply) }} NEXL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作区域 -->
    <div class="actions-section">
      <div class="actions-grid">
        <div class="action-card glass-card quick-actions">
          <h3 class="card-title">快速操作</h3>
          <div class="action-buttons">
            <button class="gradient-btn transfer-btn" @click="showTransferDialog = true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>转账</span>
            </button>
            <button class="gradient-btn mint-btn" @click="showMintDialog = true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>铸造</span>
            </button>
            <button class="skeuomorphic-btn history-btn" @click="showTransactionHistory = true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v5h5M21 21v-5h-5M21 3h-5v5M3 21h5v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>交易历史</span>
            </button>
          </div>
        </div>
        
        <div class="action-card glass-card calculator">
          <h3 class="card-title">收益计算器</h3>
          <div class="calculator-content">
            <div class="calc-inputs">
              <div class="input-group">
                <label class="input-label">质押数量</label>
                <input 
                  v-model.number="calcAmount" 
                  type="number" 
                  class="glass-input calc-input"
                  placeholder="输入质押数量"
                  min="1"
                  max="100000"
                />
              </div>
              <div class="input-group">
                <label class="input-label">质押期限</label>
                <select v-model="calcPeriod" class="glass-select calc-select">
                  <option :value="30">30天 (15% APR)</option>
                  <option :value="90">90天 (18% APR)</option>
                  <option :value="180">180天 (20% APR)</option>
                  <option :value="365">365天 (25% APR)</option>
                </select>
              </div>
            </div>
            <button class="gradient-btn calc-btn" @click="calculateReturns">
              <span>计算收益</span>
            </button>
            <div v-if="calcResult" class="calc-results glass-card">
              <div class="result-item">
                <span class="result-label">预期收益</span>
                <span class="result-value reward">{{ calcResult.reward }} NEXL</span>
              </div>
              <div class="result-item">
                <span class="result-label">总回报</span>
                <span class="result-value total">{{ calcResult.total }} NEXL</span>
              </div>
              <div class="result-item">
                <span class="result-label">年化收益率</span>
                <span class="result-value apr">{{ calcResult.apr }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 质押对话框 -->
    <el-dialog v-model="showStakeDialog" title="质押NEXL代币" width="500px" class="modern-dialog">
      <div class="dialog-content">
        <div class="form-group">
          <label class="form-label">质押数量</label>
          <div class="input-with-balance">
            <input 
              v-model.number="stakeForm.amount" 
              type="number" 
              class="glass-input"
              placeholder="输入质押数量"
              min="1"
              :max="nexlBalance"
            />
            <span class="balance-hint">可用: {{ formatToken(nexlBalance) }} NEXL</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">质押期限</label>
          <select v-model="stakeForm.lockPeriod" class="glass-select">
            <option :value="30">30天 (15% APR)</option>
            <option :value="90">90天 (18% APR)</option>
            <option :value="180">180天 (20% APR)</option>
            <option :value="365">365天 (25% APR)</option>
          </select>
        </div>
        <div class="expected-reward">
          <span class="reward-label">预期收益</span>
          <span class="reward-value">{{ calculateExpectedReward(stakeForm.amount, stakeForm.lockPeriod) }} NEXL</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="skeuomorphic-btn" @click="showStakeDialog = false">取消</button>
          <button class="gradient-btn" @click="confirmStake" :loading="stakingLoading">
            <span>确认质押</span>
          </button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 解押对话框 -->
    <el-dialog v-model="showUnstakeDialog" title="解押NEXL代币" width="600px" class="modern-dialog">
      <div v-if="availableStakes.length > 0" class="dialog-content">
        <div class="stakes-list">
          <div v-for="stake in availableStakes" :key="stake.startTime" class="stake-item glass-card">
            <div class="stake-info">
              <div class="stake-amount">{{ formatToken(stake.amount) }} NEXL</div>
              <div class="stake-period">{{ stake.lockPeriod }}天锁仓期</div>
              <div class="stake-end">到期: {{ formatDate(stake.endTime) }}</div>
            </div>
            <button class="gradient-btn unstake-btn" @click="unstake(stake)">
              <span>解押</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M9 14l6-6m0 0l-6-6m6 6H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h4 class="empty-title">暂无可解押的质押</h4>
        <p class="empty-description">您的质押尚未到期或已全部解押</p>
      </div>
    </el-dialog>
    
    <!-- 转账对话框 -->
    <el-dialog v-model="showTransferDialog" title="转账" width="500px" class="modern-dialog">
      <div class="dialog-content">
        <div class="form-group">
          <label class="form-label">代币类型</label>
          <select v-model="transferForm.token" class="glass-select">
            <option value="NEXL">NEXL</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">接收地址</label>
          <input 
            v-model="transferForm.to" 
            type="text" 
            class="glass-input"
            placeholder="输入接收地址"
          />
        </div>
        <div class="form-group">
          <label class="form-label">转账数量</label>
          <div class="input-with-balance">
            <input 
              v-model.number="transferForm.amount" 
              type="number" 
              class="glass-input"
              placeholder="输入转账数量"
              min="0.01"
              step="0.01"
            />
            <span class="balance-hint">可用: {{ formatToken(getAvailableBalance(transferForm.token)) }} {{ transferForm.token }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="skeuomorphic-btn" @click="showTransferDialog = false">取消</button>
          <button class="gradient-btn" @click="confirmTransfer" :loading="transferLoading">
            <span>确认转账</span>
          </button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 铸造对话框 -->
    <el-dialog v-model="showMintDialog" title="铸造代币" width="500px" class="modern-dialog">
      <div class="dialog-content">
        <div class="form-group">
          <label class="form-label">代币类型</label>
          <select v-model="mintForm.token" class="glass-select">
            <option value="NEXL">NEXL</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">铸造数量</label>
          <input 
            v-model.number="mintForm.amount" 
            type="number" 
            class="glass-input"
            placeholder="输入铸造数量"
            min="1"
            step="100"
          />
        </div>
        <div class="form-group">
          <label class="form-label">接收地址（可选）</label>
          <input 
            v-model="mintForm.to" 
            type="text" 
            class="glass-input"
            placeholder="留空则铸造到当前地址"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="skeuomorphic-btn" @click="showMintDialog = false">取消</button>
          <button class="gradient-btn" @click="confirmMint" :loading="mintLoading">
            <span>确认铸造</span>
          </button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 交易历史对话框 -->
    <el-dialog v-model="showTransactionHistory" title="交易历史" width="800px" class="modern-dialog">
      <div class="transaction-history">
        <div v-if="transactions.length > 0" class="transactions-list">
          <div v-for="tx in transactions" :key="tx.id" class="transaction-item glass-card">
            <div class="tx-type">
              <div class="type-badge" :class="getTransactionType(tx.type)">
                {{ getTransactionLabel(tx.type) }}
              </div>
            </div>
            <div class="tx-details">
              <div class="tx-amount">{{ formatToken(tx.amount) }} NEXL</div>
              <div class="tx-time">{{ formatDate(tx.timestamp) }}</div>
            </div>
            <div class="tx-status">
              <div class="status-badge" :class="tx.status">
                {{ tx.status === 'completed' ? '成功' : '失败' }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v5h5M21 21v-5h-5M21 3h-5v5M3 21h5v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h4 class="empty-title">暂无交易记录</h4>
          <p class="empty-description">您的交易记录将在这里显示</p>
        </div>
      </div>
    </el-dialog>
    
    <!-- 质押对话框 -->
    <el-dialog v-model="showStakeDialog" title="质押NEXL代币" width="500px">
      <el-form :model="stakeForm" label-width="100px">
        <el-form-item label="质押数量" required>
          <el-input-number v-model="stakeForm.amount" :min="1" :max="nexlBalance" />
          <span style="margin-left: 8px; color: #666;">可用: {{ formatToken(nexlBalance) }} NEXL</span>
        </el-form-item>
        <el-form-item label="质押期限" required>
          <el-select v-model="stakeForm.lockPeriod" style="width: 100%">
            <el-option label="30天 (15% APR)" :value="30" />
            <el-option label="90天 (18% APR)" :value="90" />
            <el-option label="180天 (20% APR)" :value="180" />
            <el-option label="365天 (25% APR)" :value="365" />
          </el-select>
        </el-form-item>
        <el-form-item label="预期收益">
          <span style="color: #409eff; font-weight: bold;">
            {{ calculateExpectedReward(stakeForm.amount, stakeForm.lockPeriod) }} NEXL
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showStakeDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmStake" :loading="stakingLoading">
          确认质押
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 解押对话框 -->
    <el-dialog v-model="showUnstakeDialog" title="解押NEXL代币" width="500px">
      <div v-if="availableStakes.length > 0">
        <el-table :data="availableStakes" style="width: 100%">
          <el-table-column prop="amount" label="质押数量" width="120">
            <template #default="{ row }">
              {{ formatToken(row.amount) }} NEXL
            </template>
          </el-table-column>
          <el-table-column prop="lockPeriod" label="锁仓期" width="100">
            <template #default="{ row }">
              {{ row.lockPeriod }}天
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="到期时间" width="140">
            <template #default="{ row }">
              {{ formatDate(row.endTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="unstake(row)">
                解押
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else style="text-align: center; padding: 40px;">
        <el-empty description="暂无可解押的质押" />
      </div>
    </el-dialog>
    
    <!-- 转账对话框 -->
    <el-dialog v-model="showTransferDialog" title="转账" width="500px">
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="代币类型" required>
          <el-select v-model="transferForm.token" style="width: 100%">
            <el-option label="NEXL" value="NEXL" />
            <el-option label="USDC" value="USDC" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收地址" required>
          <el-input v-model="transferForm.to" placeholder="输入接收地址" />
        </el-form-item>
        <el-form-item label="转账数量" required>
          <el-input-number v-model="transferForm.amount" :min="0.01" :step="0.01" />
          <span style="margin-left: 8px; color: #666;">
            可用: {{ formatToken(getAvailableBalance(transferForm.token)) }} {{ transferForm.token }}
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTransferDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmTransfer" :loading="transferLoading">
          确认转账
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 铸造对话框 -->
    <el-dialog v-model="showMintDialog" title="铸造代币" width="500px">
      <el-form :model="mintForm" label-width="100px">
        <el-form-item label="代币类型" required>
          <el-select v-model="mintForm.token" style="width: 100%">
            <el-option label="NEXL" value="NEXL" />
          </el-select>
        </el-form-item>
        <el-form-item label="铸造数量" required>
          <el-input-number v-model="mintForm.amount" :min="1" :step="100" />
        </el-form-item>
        <el-form-item label="接收地址">
          <el-input v-model="mintForm.to" placeholder="留空则铸造到当前地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showMintDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmMint" :loading="mintLoading">
          确认铸造
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 交易历史对话框 -->
    <el-dialog v-model="showTransactionHistory" title="交易历史" width="800px">
      <el-table :data="transactions" style="width: 100%" max-height="400">
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTransactionType(row.type)">
              {{ getTransactionLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" width="120">
          <template #default="{ row }">
            {{ formatToken(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'danger'">
              {{ row.status === 'completed' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTokenStore } from '../stores/token'
import { ElMessage } from 'element-plus'

const tokenStore = useTokenStore()

// 响应式数据
const showStakeDialog = ref(false)
const showUnstakeDialog = ref(false)
const showTransferDialog = ref(false)
const showMintDialog = ref(false)
const showTransactionHistory = ref(false)
const stakingLoading = ref(false)
const transferLoading = ref(false)
const mintLoading = ref(false)

// 表单数据
const stakeForm = ref({
  amount: 100,
  lockPeriod: 30
})

const transferForm = ref({
  token: 'NEXL',
  to: '',
  amount: 0
})

const mintForm = ref({
  token: 'NEXL',
  amount: 1000,
  to: ''
})

// 计算器数据
const calcAmount = ref(1000)
const calcPeriod = ref(30)
const calcResult = ref<{
  reward: number
  total: number
  apr: number
} | null>(null)

// 计算属性
const nexlBalance = computed(() => {
  const balance = tokenStore.balances.find(b => b.symbol === 'NEXL')
  return balance ? balance.balance : 0
})

const usdcBalance = computed(() => {
  const balance = tokenStore.balances.find(b => b.symbol === 'USDC')
  return balance ? balance.balance : 0
})

const totalAssetValue = computed(() => {
  return nexlBalance.value * tokenStore.tokenPrice + usdcBalance.value
})

const stakedAmount = computed(() => tokenStore.stakedAmount)
const totalRewards = computed(() => tokenStore.totalRewards)
const currentAPR = computed(() => tokenStore.calculateAPR(30))
const tokenPrice = computed(() => tokenStore.tokenPrice)
const totalSupply = computed(() => tokenStore.totalSupply)
const circulatingSupply = computed(() => tokenStore.circulatingSupply)

const availableStakes = computed(() => {
  const now = Date.now()
  return tokenStore.stakingInfo.filter(stake => now >= stake.endTime)
})

const transactions = computed(() => tokenStore.getTransactionHistory(20))

const priceChangePercent = computed(() => {
  const change = (Math.random() - 0.5) * 10 // 模拟价格变化
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
})

const priceChangeType = computed(() => {
  return priceChangePercent.value.startsWith('+') ? 'success' : 'danger'
})

// 方法
function formatToken(amount: number): string {
  return amount.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
}

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`
}

function formatPrice(price: number): string {
  return price.toFixed(4)
}

function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toString()
}

function formatAPR(apr: number): string {
  return `${(apr * 100).toFixed(2)}%`
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

function refreshData() {
  tokenStore.loadTokenData()
  ElMessage.success('数据已刷新')
}

async function confirmStake() {
  if (stakeForm.value.amount > nexlBalance.value) {
    ElMessage.error('余额不足')
    return
  }
  
  stakingLoading.value = true
  try {
    await tokenStore.stakeTokens(stakeForm.value.amount, stakeForm.value.lockPeriod)
    showStakeDialog.value = false
    ElMessage.success('质押成功')
    stakeForm.value.amount = 100
    stakeForm.value.lockPeriod = 30
  } catch (error: any) {
    ElMessage.error('质押失败')
  } finally {
    stakingLoading.value = false
  }
}

async function claimRewards() {
  try {
    const reward = await tokenStore.claimRewards()
    ElMessage.success(`成功领取 ${reward.toFixed(4)} NEXL 奖励`)
  } catch (error: any) {
    ElMessage.error('领取奖励失败')
  }
}

async function unstake(stake: any) {
  try {
    const result = await tokenStore.unstakeTokens(stake.startTime.toString())
    ElMessage.success(`解押成功，获得 ${result.total.toFixed(4)} NEXL`)
    showUnstakeDialog.value = false
  } catch (error: any) {
    ElMessage.error('解押失败')
  }
}

async function confirmTransfer() {
  if (!transferForm.value.to || transferForm.value.amount <= 0) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  const availableBalance = getAvailableBalance(transferForm.value.token)
  if (transferForm.value.amount > availableBalance) {
    ElMessage.error('余额不足')
    return
  }
  
  transferLoading.value = true
  try {
    await tokenStore.transferTokens(transferForm.value.to, transferForm.value.amount, transferForm.value.token)
    showTransferDialog.value = false
    ElMessage.success('转账成功')
    transferForm.value.to = ''
    transferForm.value.amount = 0
  } catch (error: any) {
    ElMessage.error('转账失败')
  } finally {
    transferLoading.value = false
  }
}

async function confirmMint() {
  if (mintForm.value.amount <= 0) {
    ElMessage.error('请输入铸造数量')
    return
  }
  
  mintLoading.value = true
  try {
    await tokenStore.mintTokens(mintForm.value.amount, mintForm.value.to)
    showMintDialog.value = false
    ElMessage.success('铸造成功')
    mintForm.value.amount = 1000
    mintForm.value.to = ''
  } catch (error: any) {
    ElMessage.error('铸造失败')
  } finally {
    mintLoading.value = false
  }
}

function getAvailableBalance(token: string): number {
  const balance = tokenStore.balances.find(b => b.symbol === token)
  return balance ? balance.balance : 0
}

function calculateReturns() {
  const apr = tokenStore.calculateAPR(calcPeriod.value)
  const reward = calcAmount.value * apr * (calcPeriod.value / 365)
  const total = calcAmount.value + reward
  
  calcResult.value = {
    reward: Number(reward.toFixed(4)),
    total: Number(total.toFixed(4)),
    apr: Number((apr * 100).toFixed(2))
  }
}

function calculateExpectedReward(amount: number, lockPeriod: number): string {
  const apr = tokenStore.calculateAPR(lockPeriod)
  const reward = amount * apr * (lockPeriod / 365)
  return reward.toFixed(4)
}

function getTransactionType(type: string): string {
  const types: Record<string, string> = {
    stake: 'success',
    unstake: 'warning',
    claim: 'primary',
    transfer: 'info',
    mint: 'primary'
  }
  return types[type] || 'info'
}

function getTransactionLabel(type: string): string {
  const labels: Record<string, string> = {
    stake: '质押',
    unstake: '解押',
    claim: '领取',
    transfer: '转账',
    mint: '铸造'
  }
  return labels[type] || type
}

// 生命周期
onMounted(() => {
  tokenStore.loadTokenData()
})
</script>

<style scoped>
/* ==========================================
   代币仪表板现代设计 - 融合轻拟物+液体玻璃+极简扁平化
   ========================================== */

.token-dashboard {
  position: relative;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
}

/* 动态背景装饰 */
.background-ornaments {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.ornament {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%);
  filter: blur(60px);
  animation: float 25s ease-in-out infinite;
}

.ornament-1 {
  width: 400px;
  height: 400px;
  top: 20%;
  left: 5%;
  animation-delay: 0s;
}

.ornament-2 {
  width: 300px;
  height: 300px;
  top: 60%;
  right: 10%;
  animation-delay: -8s;
}

.ornament-3 {
  width: 250px;
  height: 250px;
  bottom: 30%;
  left: 15%;
  animation-delay: -16s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(15px) rotate(240deg); }
}

/* 页面标题区域 */
.dashboard-header {
  padding: 100px 20px 60px;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.dashboard-title {
  margin: 0;
  line-height: 1.2;
}

.title-gradient {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3rem;
  font-weight: 800;
  display: block;
}

.dashboard-subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin-top: 8px;
  font-weight: 400;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 20px;
}

/* 核心数据卡片 */
.core-stats-section {
  padding: 0 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.stat-card {
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.card-icon {
  color: #667eea;
}

/* 资产概览 */
.balance-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-md);
  border: var(--subtle-border);
  transition: all 0.3s ease;
}

.balance-item:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.balance-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.balance-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.balance-usd {
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.balance-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
  margin: 8px 0;
}

.balance-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: var(--radius-md);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.total-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
}

.total-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
}

.token-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  box-shadow: var(--soft-shadow);
}

.nexl-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.usdc-icon {
  background: linear-gradient(135deg, #2775ca 0%, #1a5490 100%);
}

/* 质押信息 */
.staking-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.staking-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-md);
  border: var(--subtle-border);
  position: relative;
}

.staking-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.staking-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
}

.staking-value.reward {
  color: #48bb78;
}

.staking-value.apr {
  color: #667eea;
}

.staking-progress {
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.claim-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--soft-shadow);
}

.claim-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3);
}

.claim-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.staking-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.stake-btn,
.unstake-btn {
  flex: 1;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 16px;
}

.unstake-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 市场数据 */
.market-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.market-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-md);
  border: var(--subtle-border);
  transition: all 0.3s ease;
}

.market-item:hover {
  background: rgba(255, 255, 255, 0.6);
}

.market-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.market-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.market-value.price {
  color: #667eea;
}

.market-value.rank {
  color: #f59e0b;
}

.market-value.supply {
  color: #10b981;
}

.price-change {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.price-change.success {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.price-change.danger {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

/* 操作区域 */
.actions-section {
  padding: 0 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.action-card {
  padding: 32px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.transfer-btn,
.mint-btn,
.history-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 20px;
}

.history-btn {
  background: rgba(255, 255, 255, 0.8);
  color: #4a5568;
}

/* 收益计算器 */
.calculator-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.calc-inputs {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.input-label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.calc-input,
.calc-select {
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: var(--radius-md);
}

.calc-btn {
  align-self: flex-start;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 20px;
}

.calc-results {
  padding: 24px;
  margin-top: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.result-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.result-value.reward {
  color: #48bb78;
}

.result-value.total {
  color: #667eea;
}

.result-value.apr {
  color: #f59e0b;
}

/* 对话框样式 */
.modern-dialog {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dialog-content {
  padding: 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-with-balance {
  position: relative;
}

.balance-hint {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #a0aec0;
  pointer-events: none;
}

.expected-reward {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: var(--radius-md);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.reward-label {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 500;
}

.reward-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 交易历史 */
.transaction-history {
  max-height: 400px;
  overflow-y: auto;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  transition: all 0.3s ease;
}

.transaction-item:hover {
  transform: translateY(-1px);
}

.tx-type {
  flex-shrink: 0;
}

.type-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge.success {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.type-badge.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.type-badge.primary {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.type-badge.info {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.tx-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tx-amount {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.tx-time {
  font-size: 0.8rem;
  color: #a0aec0;
}

.tx-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.completed {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-badge.failed {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  color: #cbd5e0;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 12px;
  font-weight: 600;
}

.empty-description {
  color: #718096;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 80px 20px 40px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  
  .title-gradient {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .calc-inputs {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .staking-actions {
    flex-direction: column;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 24px;
  }
  
  .action-card {
    padding: 24px;
  }
  
  .balance-value {
    font-size: 1.2rem;
  }
  
  .total-value {
    font-size: 1.4rem;
  }
}
</style>