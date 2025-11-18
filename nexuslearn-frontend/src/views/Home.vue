<template>
  <div class="home-container borderless-container">
    <!-- 动态背景装饰 -->
    <div class="background-ornaments">
      <div class="ornament ornament-1"></div>
      <div class="ornament ornament-2"></div>
      <div class="ornament ornament-3"></div>
      <div class="ornament ornament-4"></div>
    </div>
    
    <!-- 主标题区域 -->
    <div class="hero-section">
      <div class="hero-content glass-card">
        <div class="hero-badge subtle-float">
          <span class="badge-text">Web3.0 × AI</span>
        </div>
        <h1 class="hero-title">
          <span class="title-main">NexusLearn</span>
          <span class="title-sub">智能学习平台</span>
        </h1>
        <p class="hero-description">
          融合AI与区块链技术的下一代学习生态系统
          <br>让知识成为可确权、可流通、可增值的数字资产
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">10K+</span>
            <span class="stat-label">学习者</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">知识NFT</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">DAO社区</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能特性网格 -->
    <div class="features-section">
      <div class="section-header">
        <h2 class="section-title">探索学习新维度</h2>
        <p class="section-subtitle">每个功能都重新定义了知识的价值</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-item elegant-card" @click="$router.push('/learning')">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🎯</div>
            <div class="icon-glow"></div>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">AI智能学习</h3>
            <p class="feature-description">个性化学习路径，自适应难度，让每个人都能找到最适合的学习节奏</p>
            <div class="feature-tags">
              <span class="tag">个性化</span>
              <span class="tag">自适应</span>
            </div>
          </div>
          <div class="feature-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="feature-item elegant-card" @click="$router.push('/nft-marketplace')">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🎨</div>
            <div class="icon-glow"></div>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">知识NFT市场</h3>
            <p class="feature-description">将知识转化为可确权的数字资产，在区块链上永久保存和流通</p>
            <div class="feature-tags">
              <span class="tag">确权</span>
              <span class="tag">流通</span>
            </div>
          </div>
          <div class="feature-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="feature-item elegant-card" @click="$router.push('/collaboration')">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🤝</div>
            <div class="icon-glow"></div>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">智能协作</h3>
            <p class="feature-description">看板式项目管理，NFT知识确权，让协作更加高效透明</p>
            <div class="feature-tags">
              <span class="tag">协作</span>
              <span class="tag">确权</span>
            </div>
          </div>
          <div class="feature-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="feature-item elegant-card" @click="$router.push('/community')">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">👥</div>
            <div class="icon-glow"></div>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">DAO社区</h3>
            <p class="feature-description">去中心化自治组织，让每个成员都能参与平台治理和决策</p>
            <div class="feature-tags">
              <span class="tag">治理</span>
              <span class="tag">自治</span>
            </div>
          </div>
          <div class="feature-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="feature-item elegant-card" @click="$router.push('/search')">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🔍</div>
            <div class="icon-glow"></div>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">智能搜索</h3>
            <p class="feature-description">AI驱动的内容处理，OCR识别，多语言翻译，让知识无国界</p>
            <div class="feature-tags">
              <span class="tag">AI</span>
              <span class="tag">多语言</span>
            </div>
          </div>
          <div class="feature-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="feature-item elegant-card" @click="$router.push('/governance')">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">⚖️</div>
            <div class="icon-glow"></div>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">社区治理</h3>
            <p class="feature-description">提案投票，通证激励，让每个人都有发言权，共建共享平台未来</p>
            <div class="feature-tags">
              <span class="tag">投票</span>
              <span class="tag">激励</span>
            </div>
          </div>
          <div class="feature-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- CTA 行动区域 -->
    <div class="cta-section">
      <div class="cta-content glass-card">
        <h3 class="cta-title">准备好开启学习革命了吗？</h3>
        <p class="cta-description">加入全球领先的知识经济生态，让您的学习成果转化为真正的数字资产</p>
        <div class="cta-actions">
          <button class="gradient-btn cta-primary" @click="$router.push('/learning')">
            <span>开始学习之旅</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 19M19 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="skeuomorphic-btn cta-secondary" @click="$router.push('/nft-marketplace')">
            <span>探索NFT市场</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 添加微妙的动画效果
onMounted(() => {
  // 为功能卡片添加渐入动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in-up')
        }, index * 100)
      }
    })
  })

  document.querySelectorAll('.feature-item').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
/* ==========================================
   现代首页样式 - 融合轻拟物+液体玻璃+极简扁平化
   ========================================== */

.home-container {
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  filter: blur(40px);
  animation: float 20s ease-in-out infinite;
}

.ornament-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.ornament-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.ornament-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

.ornament-4 {
  width: 250px;
  height: 250px;
  top: 30%;
  right: 30%;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

/* 主标题区域 */
.hero-section {
  padding: 120px 20px 80px;
  text-align: center;
  position: relative;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0.05;
  z-index: -1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: var(--soft-shadow);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.badge-text {
  font-size: 14px;
  font-weight: 600;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-title {
  margin: 0 0 16px 0;
  line-height: 1.1;
}

.title-main {
  display: block;
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.title-sub {
  display: block;
  font-size: 2rem;
  font-weight: 300;
  color: #718096;
  margin-bottom: 24px;
}

.hero-description {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

/* 功能特性区域 */
.features-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #718096;
  font-weight: 400;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

.feature-item {
  padding: 32px;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.feature-item:hover {
  transform: translateY(-8px);
}

.feature-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.feature-icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--soft-shadow);
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.3;
  z-index: 1;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  line-height: 1.3;
}

.feature-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.feature-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.feature-arrow {
  color: #cbd5e0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.feature-item:hover .feature-arrow {
  color: #667eea;
  transform: translateX(4px);
  background: rgba(102, 126, 234, 0.1);
}

/* CTA 区域 */
.cta-section {
  padding: 80px 20px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 32px;
  text-align: center;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-description {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  font-size: 1.1rem;
  border-radius: 24px;
  font-weight: 600;
}

.cta-secondary {
  padding: 16px 32px;
  font-size: 1.1rem;
  border-radius: 24px;
  font-weight: 500;
}

/* 渐入动画 */
.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 80px 16px 60px;
  }
  
  .hero-content {
    padding: 40px 24px;
  }
  
  .title-main {
    font-size: 2.5rem;
  }
  
  .title-sub {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .hero-stats {
    gap: 24px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .features-section {
    padding: 60px 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-item {
    padding: 24px;
    flex-direction: column;
    text-align: center;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-primary,
  .cta-secondary {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .title-main {
    font-size: 2rem;
  }
  
  .title-sub {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
}
</style>
