<template>
  <div class="nft-marketplace borderless-container">
    <!-- 动态背景装饰 -->
    <div class="background-ornaments">
      <div class="ornament ornament-1"></div>
      <div class="ornament ornament-2"></div>
      <div class="ornament ornament-3"></div>
    </div>
    
    <!-- 页面标题区域 -->
    <div class="marketplace-header">
      <div class="header-content glass-card">
        <div class="header-text">
          <h1 class="marketplace-title">
            <span class="title-gradient">知识NFT市场</span>
          </h1>
          <p class="marketplace-subtitle">发现、收藏、交易独特的知识数字资产</p>
        </div>
        <button class="gradient-btn mint-btn" @click="handleMintNFT">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>铸造NFT</span>
        </button>
      </div>
    </div>
    
    <!-- 统计数据卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalNFTs }}</div>
            <div class="stat-label">总NFT数</div>
          </div>
        </div>
        
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalOwners }}</div>
            <div class="stat-label">持有者</div>
          </div>
        </div>
        
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 5h-12m0 0l4 4m-4-4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalTransactions }}</div>
            <div class="stat-label">交易数</div>
          </div>
        </div>
        
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ formatPrice(stats.totalVolume) }}</div>
            <div class="stat-label">总交易量</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <div class="filters-section">
      <div class="filters-content glass-card">
        <div class="search-group">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              v-model="searchKeyword" 
              class="glass-input search-input" 
              placeholder="搜索知识NFT..."
            />
          </div>
        </div>
        
        <div class="filter-group">
          <div class="filter-item">
            <label class="filter-label">分类</label>
            <select v-model="selectedCategory" class="glass-select">
              <option value="">全部分类</option>
              <option value="learning">学习资料</option>
              <option value="code">代码项目</option>
              <option value="design">设计作品</option>
              <option value="document">文档资料</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">价格范围</label>
            <div class="price-range">
              <input 
                v-model.number="priceRange[0]" 
                type="number" 
                class="glass-input price-input" 
                placeholder="最低价"
                min="0"
              />
              <span class="price-separator">-</span>
              <input 
                v-model.number="priceRange[1]" 
                type="number" 
                class="glass-input price-input" 
                placeholder="最高价"
                min="0"
              />
            </div>
          </div>
          
          <div class="filter-actions">
            <button class="gradient-btn filter-btn" @click="loadNFTs">
              <span>搜索</span>
            </button>
            <button class="skeuomorphic-btn reset-btn" @click="resetFilters">
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- NFT网格展示 -->
    <div class="nft-grid-section">
      <div class="grid-header">
        <h3 class="grid-title">发现知识宝藏</h3>
        <p class="grid-subtitle">{{ filteredNFTs.length }} 个独特的知识NFT等待您的发现</p>
      </div>
      
      <div class="nft-grid" v-loading="loading">
        <div v-if="filteredNFTs.length === 0" class="empty-state glass-card">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 14l6-6m0 0l-6-6m6 6H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h4 class="empty-title">暂无相关NFT</h4>
          <p class="empty-description">尝试调整搜索条件或创建您自己的NFT</p>
          <button class="gradient-btn" @click="showMintDialog = true">
            <span>创建NFT</span>
          </button>
        </div>
        
        <div v-else class="nft-cards-container">
          <div 
            v-for="(nft, index) in filteredNFTs" 
            :key="nft.id" 
            class="nft-card elegant-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="showNFTDetail(nft)"
          >
            <div class="nft-card-header">
              <div class="nft-category-badge" :class="`category-${nft.category}`">
                {{ getCategoryLabel(nft.category) }}
              </div>
              <div v-if="nft.rarity" class="nft-rarity-badge" :class="`rarity-${nft.rarity}`">
                {{ nft.rarity }}
              </div>
            </div>
            
            <div class="nft-image-container">
              <div class="image-wrapper">
                <img 
                  :src="nft.image || getNFTImage(nft)" 
                  :alt="nft.name" 
                  class="nft-image"
                  @error="handleImageError"
                />
                <div class="image-shimmer"></div>
                <div class="nft-badge-collection">
                  <div v-if="nft.rarity" class="rarity-indicator" :class="`rarity-${nft.rarity}`">
                    <span class="rarity-text">{{ nft.rarity }}</span>
                  </div>
                  <div class="freshness-indicator" v-if="isFreshNFT(nft.createdAt)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>新</span>
                  </div>
                </div>
              </div>
              <div class="nft-image-overlay">
                <div class="overlay-content">
                  <button class="overlay-btn primary" @click.stop="buyNFT(nft)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>购买</span>
                  </button>
                  <button class="overlay-btn secondary" @click.stop="makeOffer(nft)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>出价</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="nft-content">
              <h4 class="nft-name">{{ nft.name }}</h4>
              <p class="nft-description">{{ truncateDescription(nft.description) }}</p>
              
              <div class="nft-meta">
                <div class="nft-price-info">
                  <span class="price-label">价格</span>
                  <span class="price-value">{{ formatPrice(nft.price) }} USDC</span>
                </div>
                <div class="nft-owner-info">
                  <span class="owner-label">持有者</span>
                  <span class="owner-address">{{ shortenAddress(nft.owner) }}</span>
                </div>
              </div>
              
              <div class="nft-tags">
                <span 
                  v-for="tag in (nft.tags || []).slice(0, 3)" 
                  :key="tag" 
                  class="nft-tag"
                  :class="`tag-${getTagType(tag)}`"
                >
                  {{ tag }}
                </span>
                <span v-if="(nft.tags || []).length > 3" class="nft-tag more-tags">
                  +{{ (nft.tags || []).length - 3 }}
                </span>
              </div>
              
              <div class="nft-footer">
                <div class="nft-stats">
                  <span class="stat-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    {{ nft.transactionCount }}
                  </span>
                </div>
                <div class="nft-time">
                  {{ formatTimeAgo(nft.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- NFT详情对话框 -->
    <el-dialog v-model="showDetailDialog" :title="selectedNFT?.name" width="800px" class="nft-detail-dialog">
      <div v-if="selectedNFT" class="nft-detail-content">
        <div class="detail-grid">
          <div class="detail-image-section">
            <div class="detail-image-container">
              <img 
                :src="selectedNFT.image || getNFTImage(selectedNFT)" 
                :alt="selectedNFT.name" 
                class="detail-image"
              />
              <div class="image-actions">
                <button class="image-action-btn" @click="viewFullImage">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="image-action-btn" @click="shareNFT">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="detail-info-section">
            <div class="info-card glass-card">
              <h5 class="info-title">NFT详情</h5>
              <div class="info-content">
                <div class="info-row">
                  <span class="info-label">描述</span>
                  <p class="info-value description">{{ selectedNFT.description }}</p>
                </div>
                <div class="info-row">
                  <span class="info-label">持有者</span>
                  <div class="info-value address">
                    <span>{{ selectedNFT.owner }}</span>
                    <button class="copy-btn" @click="copyAddress(selectedNFT.owner)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h8m4-2H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="info-row">
                  <span class="info-label">价格</span>
                  <div class="info-value price-info">
                    <span class="price">{{ formatPrice(selectedNFT.price) }} USDC</span>
                    <span class="price-usd">≈ ${{ selectedNFT ? (selectedNFT.price * 1).toFixed(2) : '0.00' }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <span class="info-label">分类</span>
                  <span class="category-badge" :class="`category-${selectedNFT.category}`">
                    {{ getCategoryLabel(selectedNFT.category) }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">标签</span>
                  <div class="tags-container">
                    <span v-for="tag in selectedNFT.tags" :key="tag" class="detail-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="info-row">
                  <span class="info-label">创建时间</span>
                  <span class="info-value">{{ formatDate(selectedNFT.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="detail-actions">
          <button class="gradient-btn buy-btn" @click="buyNFT(selectedNFT)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>立即购买</span>
          </button>
          <button class="skeuomorphic-btn offer-btn" @click="makeOffer(selectedNFT)">
            <span>出价</span>
          </button>
          <button class="skeuomorphic-btn history-btn" @click="viewTransactionHistory(selectedNFT)">
            <span>交易历史</span>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface NFT {
  id: string
  name: string
  description: string
  image: string
  contentURI: string
  owner: string
  creator: string
  price: number
  category: string
  tags: string[]
  rarity?: string
  createdAt: number
  transactionCount: number
}

interface Stats {
  totalNFTs: number
  totalOwners: number
  totalTransactions: number
  totalVolume: number
}

// 响应式数据
const nfts = ref<NFT[]>([])
const loading = ref(false)
const showMintDialog = ref(false)
const showDetailDialog = ref(false)
const selectedNFT = ref<NFT | null>(null)
const minting = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const selectedCategory = ref('')
const priceRange = ref([0, 1000])

// 统计数据
const stats = ref<Stats>({
  totalNFTs: 0,
  totalOwners: 0,
  totalTransactions: 0,
  totalVolume: 0
})

// 铸造表单
const mintForm = ref({
  name: '',
  description: '',
  contentURI: '',
  imageURI: '',
  category: 'learning',
  price: 100,
  tags: []
})

// 计算属性
const filteredNFTs = computed(() => {
  let result = nfts.value
  
  if (searchKeyword.value) {
    result = result.filter(nft => 
      nft && (
        nft.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    )
  }
  
  if (selectedCategory.value) {
    result = result.filter(nft => nft.category === selectedCategory.value)
  }
  
  result = result.filter(nft => 
    nft && nft.price >= (priceRange.value[0] || 0) && nft.price <= (priceRange.value[1] || Infinity)
  )
  
  return result
})

// 方法
function formatPrice(price: number): string {
  return price.toLocaleString()
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

function shortenAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getNFTImage(nft: NFT): string {
  // 根据分类返回默认图片
  const categoryImages = {
    learning: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=learning%20education%20book%20knowledge&image_size=square',
    code: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=programming%20code%20development&image_size=square',
    design: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=design%20creative%20art&image_size=square',
    document: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=document%20file%20text&image_size=square'
  }
  return categoryImages[nft.category as keyof typeof categoryImages] || categoryImages.learning
}

async function loadNFTs() {
  loading.value = true
  try {
    // 模拟加载NFT数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成示例数据
    nfts.value = [
      {
        id: '1',
        name: 'Vue3学习指南',
        description: '完整的Vue3学习资料，包含组件、路由、状态管理等核心概念',
        image: '',
        contentURI: 'ipfs://QmExample1',
        owner: '0x1234567890123456789012345678901234567890',
        creator: '0x1234567890123456789012345678901234567890',
        price: 150,
        category: 'learning',
        tags: ['Vue3', '前端开发', 'JavaScript'],
        rarity: '稀有',
        createdAt: Date.now() - 86400000,
        transactionCount: 5
      },
      {
        id: '2',
        name: '智能合约开发教程',
        description: 'Solidity智能合约开发从入门到精通，包含实战项目',
        image: '',
        contentURI: 'ipfs://QmExample2',
        owner: '0x2345678901234567890123456789012345678901',
        creator: '0x2345678901234567890123456789012345678901',
        price: 200,
        category: 'code',
        tags: ['Solidity', '区块链', '智能合约'],
        createdAt: Date.now() - 172800000,
        transactionCount: 3
      },
      {
        id: '3',
        name: 'UI设计系统',
        description: '现代化的UI设计系统，包含组件库和设计规范',
        image: '',
        contentURI: 'ipfs://QmExample3',
        owner: '0x3456789012345678901234567890123456789012',
        creator: '0x3456789012345678901234567890123456789012',
        price: 300,
        category: 'design',
        tags: ['UI设计', 'Figma', '设计系统'],
        rarity: '史诗',
        createdAt: Date.now() - 259200000,
        transactionCount: 8
      },
      {
        id: '4',
        name: '机器学习算法集',
        description: '常用机器学习算法的实现和原理解析',
        image: '',
        contentURI: 'ipfs://QmExample4',
        owner: '0x4567890123456789012345678901234567890123',
        creator: '0x4567890123456789012345678901234567890123',
        price: 250,
        category: 'learning',
        tags: ['机器学习', 'Python', '算法'],
        createdAt: Date.now() - 345600000,
        transactionCount: 12
      }
    ]
    
  } catch (error: any) {
    ElMessage.error('加载NFT失败')
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  // 模拟加载统计数据
  stats.value = {
    totalNFTs: 128,
    totalOwners: 45,
    totalTransactions: 342,
    totalVolume: 15680
  }
}

function resetFilters() {
  searchKeyword.value = ''
  selectedCategory.value = ''
  priceRange.value = [0, 1000]
  loadNFTs()
}

function showNFTDetail(nft: NFT) {
  selectedNFT.value = nft
  showDetailDialog.value = true
}

async function handleMintNFT() {
  if (!mintForm.value.name || !mintForm.value.description || !mintForm.value.contentURI) {
    ElMessage.error('请填写必要信息')
    return
  }
  
  minting.value = true
  try {
    // 模拟铸造过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newNFT: NFT = {
      id: Date.now().toString(),
      name: mintForm.value.name,
      description: mintForm.value.description,
      image: mintForm.value.imageURI,
      contentURI: mintForm.value.contentURI,
      owner: '0xCurrentUser',
      creator: '0xCurrentUser',
      price: mintForm.value.price,
      category: mintForm.value.category,
      tags: mintForm.value.tags,
      createdAt: Date.now(),
      transactionCount: 0
    }
    
    nfts.value.unshift(newNFT)
    showMintDialog.value = false
    ElMessage.success('NFT铸造成功！')
    
    // 重置表单
    mintForm.value = {
      name: '',
      description: '',
      contentURI: '',
      imageURI: '',
      category: 'learning',
      price: 100,
      tags: []
    }
} catch (error: any) {
  ElMessage.error('铸造失败')
} finally {
  minting.value = false
}
}

async function buyNFT(nft: NFT) {
  try {
    // 模拟购买过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success(`成功购买 ${nft.name}！`)
} catch (error: any) {
  ElMessage.error('购买失败')
}
}

async function makeOffer(nft: NFT) {
  try {
    // 模拟出价过程
    ElMessage.success(`已向 ${nft.name} 出价！`)
} catch (error: any) {
  ElMessage.error('出价失败')
}
}

function viewTransactionHistory(nft: NFT) {
  ElMessage.info(`查看 ${nft.name} 的交易历史`)
}


// 生命周期
onMounted(() => {
  loadNFTs()
  loadStats()
})

function truncateDescription(text: string): string {
  if (!text) return ''
  return text.length > 120 ? text.slice(0, 117) + '...' : text
}

function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = { learning: '学习资料', code: '代码项目', design: '设计作品', document: '文档资料' }
  return map[cat] || cat
}

function getTagType(tag: string): string {
  const t = tag.toLowerCase()
  if (t.includes('javascript') || t.includes('js')) return 'javascript'
  if (t.includes('python')) return 'python'
  if (t.includes('ml') || t.includes('机器学习')) return 'ml'
  if (t.includes('区块链') || t.includes('blockchain')) return 'blockchain'
  if (t.includes('前端')) return 'frontend'
  if (t.includes('后端')) return 'backend'
  return 'frontend'
}

function formatTimeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=knowledge&image_size=square'
}

function viewFullImage() {
  if (!selectedNFT.value) return
  const src = selectedNFT.value.image || getNFTImage(selectedNFT.value)
  window.open(src, '_blank')
}

function isFreshNFT(timestamp: number): boolean {
  const now = Date.now()
  const diff = now - timestamp
  const hours = diff / (1000 * 60 * 60)
  return hours < 24 // 24小时内为新鲜NFT
}

async function shareNFT() {
  if (!selectedNFT.value) return
  const url = location.href
  try {
    if ((navigator as any).share) {
      await (navigator as any).share({ title: selectedNFT.value.name, url })
    }
  } catch {}
}

async function copyAddress(addr: string) {
  try {
    await navigator.clipboard.writeText(addr)
    ElMessage.success('地址已复制')
  } catch (error: any) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
/* ==========================================
   NFT市场现代设计 - 融合轻拟物+液体玻璃+极简扁平化
   ========================================== */

.nft-marketplace {
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
.marketplace-header {
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

.marketplace-title {
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

.marketplace-subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin-top: 8px;
  font-weight: 400;
}

.mint-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 24px;
}

/* 统计数据区域 */
.stats-section {
  padding: 0 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  padding: 32px 24px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  color: #667eea;
  flex-shrink: 0;
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

/* 搜索和筛选区域 */
.filters-section {
  padding: 0 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.filters-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-group {
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  font-size: 1rem;
  border-radius: 24px;
}

.filter-group {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.glass-select {
  background: rgba(255, 255, 255, 0.6);
  border: var(--subtle-border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: #4a5568;
  font-weight: var(--font-weight-medium);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 
    inset 0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  min-width: 150px;
}

.glass-select:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 
    inset 0 1px 3px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(102, 126, 234, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.8);
}

.price-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-input {
  width: 120px;
  padding: 12px 16px;
  text-align: center;
}

.price-separator {
  color: #a0aec0;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-btn {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 20px;
}

.reset-btn {
  padding: 12px 24px;
  font-weight: 500;
  border-radius: 20px;
}

/* NFT网格展示 */
.nft-grid-section {
  padding: 0 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-header {
  text-align: center;
  margin-bottom: 40px;
}

.grid-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.grid-subtitle {
  font-size: 1.1rem;
  color: #718096;
  font-weight: 400;
}

.nft-grid {
  min-height: 400px;
}

.empty-state {
  padding: 80px 40px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
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
  margin-bottom: 32px;
  line-height: 1.5;
}

.nft-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.nft-card {
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nft-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.nft-card-header {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 3;
  pointer-events: none;
}

.nft-category-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nft-rarity-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.category-learning {
  background: rgba(102, 126, 234, 0.9);
  color: white;
}

.category-code {
  background: rgba(245, 87, 108, 0.9);
  color: white;
}

.category-design {
  background: rgba(79, 172, 254, 0.9);
  color: white;
}

.category-document {
  background: rgba(240, 147, 251, 0.9);
  color: white;
}

.rarity-普通 {
  background: rgba(160, 174, 192, 0.9);
  color: white;
}

.rarity-稀有 {
  background: rgba(72, 187, 120, 0.9);
  color: white;
}

.rarity-史诗 {
  background: rgba(66, 153, 225, 0.9);
  color: white;
}

.rarity-传说 {
  background: rgba(159, 122, 234, 0.9);
  color: white;
}

.nft-image-container {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.nft-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.nft-card:hover .nft-image {
  transform: scale(1.05);
}

.nft-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nft-card:hover .nft-image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 12px;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.nft-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.overlay-btn.primary {
  background: rgba(102, 126, 234, 0.9);
  color: white;
}

.overlay-btn.secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #4a5568;
}

.overlay-btn:hover {
  transform: translateY(-2px);
}

.nft-content {
  padding: 24px;
}

.nft-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  line-height: 1.3;
}

.nft-description {
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nft-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nft-price-info,
.nft-owner-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label,
.owner-label {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.owner-address {
  font-size: 0.9rem;
  color: #4a5568;
  font-family: 'Courier New', monospace;
}

.nft-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.nft-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.nft-tag:hover {
  transform: translateY(-1px);
}

.tag-javascript {
  background: rgba(247, 223, 30, 0.2);
  color: #f7df1e;
}

.tag-python {
  background: rgba(55, 118, 171, 0.2);
  color: #3776ab;
}

.tag-ml {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.tag-blockchain {
  background: rgba(247, 147, 26, 0.2);
  color: #f7931a;
}

.tag-frontend {
  background: rgba(97, 218, 251, 0.2);
  color: #61dafb;
}

.tag-backend {
  background: rgba(97, 175, 239, 0.2);
  color: #61afff;
}

.more-tags {
  background: rgba(160, 174, 192, 0.2);
  color: #a0aec0;
  cursor: pointer;
}

.nft-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}

.nft-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #a0aec0;
  font-size: 0.8rem;
  font-weight: 500;
}

.nft-time {
  color: #a0aec0;
  font-size: 0.8rem;
  font-weight: 500;
}

/* NFT详情对话框 */
.nft-detail-dialog {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nft-detail-content {
  padding: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.detail-image-section {
  position: relative;
}

.detail-image-container {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #f7fafc;
}

.detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

.image-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
}

.image-action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--soft-shadow);
}

.image-action-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #667eea;
  transform: translateY(-2px);
}

.detail-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  padding: 24px;
  flex: 1;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #4a5568;
  font-weight: 500;
}

.info-value.description {
  line-height: 1.6;
  color: #4a5568;
}

.info-value.address {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.copy-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.price-usd {
  font-size: 0.9rem;
  color: #a0aec0;
}

.category-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-tag {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.detail-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.buy-btn,
.offer-btn,
.history-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 20px;
}

.buy-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.offer-btn,
.history-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #4a5568;
  border: var(--subtle-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  
  .title-gradient {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 24px 16px;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-content {
    text-align: center;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nft-cards-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .detail-image {
    height: 300px;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .nft-cards-container {
    grid-template-columns: 1fr;
  }
  
  .nft-content {
    padding: 20px;
  }
}

/* 新增现代化样式 */
.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
  pointer-events: none;
}

.nft-badge-collection {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.rarity-indicator {
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--soft-shadow);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rarity-indicator.rarity-普通 {
  background: rgba(160, 174, 192, 0.9);
  color: white;
}

.rarity-indicator.rarity-稀有 {
  background: rgba(72, 187, 120, 0.9);
  color: white;
}

.rarity-indicator.rarity-史诗 {
  background: rgba(66, 153, 225, 0.9);
  color: white;
}

.rarity-indicator.rarity-传说 {
  background: rgba(159, 122, 234, 0.9);
  color: white;
}

.freshness-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 193, 7, 0.9);
  color: #856404;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: pulse 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(1deg);
  }
  66% {
    transform: translateY(-10px) rotate(-1deg);
  }
}
</style>

function formatTimeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=knowledge&image_size=square'
}

function viewFullImage() {
  if (!selectedNFT.value) return
  const src = selectedNFT.value.image || getNFTImage(selectedNFT.value)
  window.open(src, '_blank')
}

async function shareNFT() {
  if (!selectedNFT.value) return
  const url = location.href
  try {
    if ((navigator as any).share) {
      await (navigator as any).share({ title: selectedNFT.value.name, url })
    }
  } catch {}
}

async function copyAddress(addr: string) {
  try {
    await navigator.clipboard.writeText(addr)
    ElMessage.success('地址已复制')
  } catch (error: any) {
    ElMessage.error('复制失败')
  }
}