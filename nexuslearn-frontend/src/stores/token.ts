import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TokenBalance {
  symbol: string
  balance: number
  decimals: number
  address: string
}

export interface StakingInfo {
  amount: number
  reward: number
  lockPeriod: number
  startTime: number
  endTime: number
}

export interface Transaction {
  id: string
  type: 'stake' | 'unstake' | 'claim' | 'transfer' | 'mint'
  amount: number
  timestamp: number
  status: 'pending' | 'completed' | 'failed'
  hash?: string
}

export const useTokenStore = defineStore('token', () => {
  // 状态
  const balances = ref<TokenBalance[]>([
    { symbol: 'NEXL', balance: 1000, decimals: 18, address: '0xNEXL' },
    { symbol: 'USDC', balance: 500, decimals: 6, address: '0xUSDC' }
  ])
  
  const stakingInfo = ref<StakingInfo[]>([])
  const transactions = ref<Transaction[]>([])
  const totalSupply = ref(10000000) // 1000万 NEXL
  const circulatingSupply = ref(5000000) // 500万 NEXL
  const marketCap = ref(5000000) // 500万美元
  const tokenPrice = ref(1.0) // 1 NEXL = 1 USD
  
  // 计算属性
  const totalBalance = computed(() => {
    return balances.value.reduce((sum, token) => sum + token.balance, 0)
  })
  
  const stakedAmount = computed(() => {
    return stakingInfo.value.reduce((sum, stake) => sum + stake.amount, 0)
  })
  
  const totalRewards = computed(() => {
    return stakingInfo.value.reduce((sum, stake) => sum + stake.reward, 0)
  })
  
  // 方法
  async function loadTokenData() {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新价格（模拟市场波动）
      const priceChange = (Math.random() - 0.5) * 0.1
      tokenPrice.value = Math.max(0.1, tokenPrice.value * (1 + priceChange))
      
      // 更新市值
      marketCap.value = circulatingSupply.value * tokenPrice.value
      
      return {
        balances: balances.value,
        tokenPrice: tokenPrice.value,
        marketCap: marketCap.value
      }
    } catch (error) {
      console.error('加载代币数据失败:', error)
      throw error
    }
  }
  
  async function stakeTokens(amount: number, lockPeriod: number = 30) {
    try {
      const nexlBalance = balances.value.find(b => b.symbol === 'NEXL')
      if (!nexlBalance || nexlBalance.balance < amount) {
        throw new Error('余额不足')
      }
      
      // 扣除余额
      nexlBalance.balance -= amount
      
      // 创建质押记录
      const now = Date.now()
      const endTime = now + lockPeriod * 24 * 60 * 60 * 1000
      
      const stakingRecord: StakingInfo = {
        amount,
        reward: 0,
        lockPeriod,
        startTime: now,
        endTime
      }
      
      stakingInfo.value.push(stakingRecord)
      
      // 添加交易记录
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'stake',
        amount,
        timestamp: now,
        status: 'completed'
      }
      
      transactions.value.unshift(transaction)
      
      return stakingRecord
    } catch (error) {
      console.error('质押失败:', error)
      throw error
    }
  }
  
  async function unstakeTokens(stakingId: string) {
    try {
      const stakeIndex = stakingInfo.value.findIndex(s => s.startTime.toString() === stakingId)
      if (stakeIndex === -1) {
        throw new Error('质押记录不存在')
      }
      
      const stake = stakingInfo.value[stakeIndex]
      const now = Date.now()
      
      if (stake && now < stake.endTime) {
        throw new Error('质押期未结束')
      }
      
      if (!stake) {
        throw new Error('质押记录不存在')
      }
      
      // 计算奖励 (年化收益率 15%)
      const stakingDuration = (now - stake.startTime) / (1000 * 60 * 60 * 24)
      const annualRate = 0.15
      const reward = stake.amount * annualRate * (stakingDuration / 365)
      
      // 返还本金和奖励
      const nexlBalance = balances.value.find(b => b.symbol === 'NEXL')
      if (nexlBalance) {
        nexlBalance.balance += stake.amount + reward
      }
      
      // 移除质押记录
      stakingInfo.value.splice(stakeIndex, 1)
      
      // 添加交易记录
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'unstake',
        amount: stake.amount + reward,
        timestamp: now,
        status: 'completed'
      }
      
      transactions.value.unshift(transaction)
      
      return {
        principal: stake.amount,
        reward,
        total: stake.amount + reward
      }
    } catch (error) {
      console.error('解押失败:', error)
      throw error
    }
  }
  
  async function claimRewards() {
    try {
      let totalReward = 0
      const now = Date.now()
      
      // 计算所有可领取的奖励
      stakingInfo.value.forEach(stake => {
        if (now >= stake.endTime) {
          const stakingDuration = (now - stake.startTime) / (1000 * 60 * 60 * 24)
          const annualRate = 0.15
          const reward = stake.amount * annualRate * (stakingDuration / 365)
          
          totalReward += reward
          stake.reward = reward
        }
      })
      
      if (totalReward > 0) {
        const nexlBalance = balances.value.find(b => b.symbol === 'NEXL')
        if (nexlBalance) {
          nexlBalance.balance += totalReward
        }
        
        // 添加交易记录
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: 'claim',
          amount: totalReward,
          timestamp: now,
          status: 'completed'
        }
        
        transactions.value.unshift(transaction)
      }
      
      return totalReward
    } catch (error) {
      console.error('领取奖励失败:', error)
      throw error
    }
  }
  
  async function transferTokens(_to: string, amount: number, symbol: string = 'NEXL') {
    try {
      const balance = balances.value.find(b => b.symbol === symbol)
      if (!balance || balance.balance < amount) {
        throw new Error('余额不足')
      }
      
      // 扣除发送方余额
      balance.balance -= amount
      
      // 添加交易记录
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'transfer',
        amount,
        timestamp: Date.now(),
        status: 'completed'
      }
      
      transactions.value.unshift(transaction)
      
      return transaction
    } catch (error) {
      console.error('转账失败:', error)
      throw error
    }
  }
  
  async function mintTokens(amount: number, _to: string) {
    try {
      // 增加流通供应量
      circulatingSupply.value += amount
      
      // 添加交易记录
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'mint',
        amount,
        timestamp: Date.now(),
        status: 'completed'
      }
      
      transactions.value.unshift(transaction)
      
      return transaction
    } catch (error) {
      console.error('铸造失败:', error)
      throw error
    }
  }
  
  function getTransactionHistory(limit: number = 10) {
    return transactions.value.slice(0, limit)
  }
  
  function calculateAPR(lockPeriod: number): number {
    // 根据锁仓期计算年化收益率
    if (lockPeriod >= 365) return 0.25 // 25%
    if (lockPeriod >= 180) return 0.20 // 20%
    if (lockPeriod >= 90) return 0.18 // 18%
    if (lockPeriod >= 30) return 0.15 // 15%
    return 0.10 // 10%
  }
  
  function formatTokenAmount(amount: number, decimals: number = 18): string {
    return (amount / Math.pow(10, decimals)).toFixed(4)
  }
  
  function formatUSDValue(amount: number, price: number = tokenPrice.value): string {
    return `$${(amount * price).toFixed(2)}`
  }
  
  return {
    // 状态
    balances,
    stakingInfo,
    transactions,
    totalSupply,
    circulatingSupply,
    marketCap,
    tokenPrice,
    
    // 计算属性
    totalBalance,
    stakedAmount,
    totalRewards,
    
    // 方法
    loadTokenData,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    transferTokens,
    mintTokens,
    getTransactionHistory,
    calculateAPR,
    formatTokenAmount,
    formatUSDValue
  }
})