import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import './styles/design-system.css'
import App from './App.vue'
/// <reference types="vite-plugin-pwa/client" />
import { registerSW } from 'virtual:pwa-register'

// 注册 PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('新版本可用，立即更新？')) updateSW(true)
  }
})

import Home from './views/Home.vue'
import Learning from './views/Learning.vue'
import Search from './views/Search.vue'
import Collaboration from './views/Collaboration.vue'
import Governance from './views/Governance.vue'
import Progress from './views/Progress.vue'
import Materials from './views/Materials.vue'
import Community from './views/Community.vue'
import NFTMarketplace from './views/NFTMarketplace.vue'
import ContextEngine from './views/ContextEngine.vue'
import CodeWarehouse from './views/CodeWarehouse.vue'
import AdvancedSearch from './views/AdvancedSearch.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/dashboard', name: 'dashboard', component: () => import('./views/Dashboard.vue') },
  { path: '/learning', name: 'learning', component: Learning },
  { path: '/search', name: 'search', component: Search },
  { path: '/advanced-search', name: 'advanced-search', component: AdvancedSearch },
  { path: '/collaboration', name: 'collaboration', component: Collaboration },
  { path: '/materials', name: 'materials', component: Materials },
  { path: '/community', name: 'community', component: Community },
  { path: '/progress', name: 'progress', component: Progress },
  { path: '/governance', name: 'governance', component: Governance },
  { path: '/nft-marketplace', name: 'nft-marketplace', component: NFTMarketplace },
  { path: '/context-engine', name: 'context-engine', component: ContextEngine },
  { path: '/code-warehouse', name: 'code-warehouse', component: CodeWarehouse }
]

const router = createRouter({ history: createWebHistory(), routes })

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh: {
      nav: { 
        home: '首页', 
        dashboard: '仪表板', 
        learning: '学习', 
        search: '搜索', 
        'advanced-search': '高级搜索',
        collaboration: '协作', 
        governance: '治理', 
        community: 'AI社区', 
        progress: '进度评估', 
        'nft-marketplace': 'NFT市场',
        'context-engine': '上下文引擎',
        'code-warehouse': '代码仓库'
      },
      learning: { goal: '目标', plan: '计划', progress: '进度', createGoal: '创建目标', createPlan: '生成计划' },
      search: { keyword: '关键词', search: '搜索', results: '结果' },
      collaboration: { demand: '需求', answer: '答案', accept: '验收', nfts: 'NFT' }
    },
    en: {
      nav: { 
        home: 'Home', 
        dashboard: 'Dashboard', 
        learning: 'Learning', 
        search: 'Search', 
        'advanced-search': 'Advanced Search',
        collaboration: 'Collaboration', 
        governance: 'Governance', 
        community: 'AI Community', 
        progress: 'Progress', 
        'nft-marketplace': 'NFT Marketplace',
        'context-engine': 'Context Engine',
        'code-warehouse': 'Code Warehouse'
      },
      learning: { goal: 'Goal', plan: 'Plan', progress: 'Progress', createGoal: 'Create Goal', createPlan: 'Generate Plan' },
      search: { keyword: 'Keyword', search: 'Search', results: 'Results' },
      collaboration: { demand: 'Demand', answer: 'Answer', accept: 'Accept', nfts: 'NFTs' }
    }
  }
})

const pinia = createPinia()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia).use(router).use(i18n).use(ElementPlus).mount('#app')
