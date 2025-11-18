<template>
  <div class="learning-container">
    <!-- 动态背景粒子效果 -->
    <div class="particles-bg">
      <div v-for="n in 20" :key="n" class="particle" :style="{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (Math.random() * 3 + 2) + 's'
      }"></div>
    </div>

    <!-- 主标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AI 驱动学习之旅</h1>
        <p class="hero-subtitle">个性化 · 自适应 · 智能化</p>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ store.masteryScore }}%</div>
            <div class="stat-label">掌握度</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ store.plan.length }}</div>
            <div class="stat-label">计划天数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ store.progress.length }}</div>
            <div class="stat-label">学习记录</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习目标设置区域 -->
    <div class="section-card goal-section">
      <div class="section-header">
        <div class="section-icon">🎯</div>
        <h2 class="section-title">智能目标设定</h2>
        <p class="section-desc">AI 将根据您的目标制定个性化学习路径</p>
      </div>
      
      <div class="goal-form">
        <div class="form-group">
          <label class="form-label">学习目标</label>
          <div class="input-wrapper">
            <input 
              v-model="goalInput" 
              class="modern-input"
              placeholder="例如：通过 CPA 考试、掌握 React 开发..."
            />
            <div class="input-glow"></div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">核心技能</label>
          <div class="skills-input-container">
            <div class="skill-tags">
              <span 
                v-for="skill in skillsArray" 
                :key="skill" 
                class="skill-tag"
                @click="removeSkill(skill)"
              >
                {{ skill }}
                <span class="remove-btn">×</span>
              </span>
            </div>
            <input 
              v-model="skillsInput"
              @keyup.enter="addSkill"
              @keyup.space="addSkill"
              class="skill-input"
              placeholder="输入技能后按回车添加..."
            />
          </div>
        </div>

        <div class="form-actions">
          <button class="action-btn primary" @click="onCreateGoal">
            <span class="btn-icon">✨</span>
            创建目标
          </button>
          <button class="action-btn secondary" @click="onGeneratePlan">
            <span class="btn-icon">🤖</span>
            AI 生成计划
          </button>
          <button class="action-btn tertiary" @click="onFetchProgress">
            <span class="btn-icon">🔄</span>
            刷新进度
          </button>
        </div>
      </div>

      <!-- 当前目标展示 -->
      <div v-if="store.goal" class="current-goal">
        <div class="goal-card">
          <div class="goal-icon">🎯</div>
          <div class="goal-content">
            <h3>{{ store.goal }}</h3>
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: store.masteryScore + '%' }"></div>
              </div>
              <span class="progress-text">{{ store.masteryScore }}% 完成</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习路径时间轴 -->
    <div v-if="store.plan.length" class="section-card timeline-section">
      <div class="section-header">
        <div class="section-icon">⏱️</div>
        <h2 class="section-title">AI 学习路径</h2>
        <p class="section-desc">智能生成的个性化学习计划</p>
      </div>
      
      <div class="timeline-container">
        <div 
          v-for="(item, index) in store.plan" 
          :key="index"
          class="timeline-item"
          :class="{ active: index === 0, completed: index < currentDayIndex }"
        >
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line" v-if="index < store.plan.length - 1"></div>
          </div>
          <div class="timeline-content">
            <div class="timeline-day">第 {{ item.day }} 天</div>
            <div class="timeline-topic">{{ item.topic }}</div>
            <div class="timeline-skills">
              <span v-for="skill in item.skills" :key="skill" class="timeline-skill">{{ skill }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自适应评估区域 -->
    <div class="section-card assessment-section">
      <div class="section-header">
        <div class="section-icon">🧠</div>
        <h2 class="section-title">智能评估系统</h2>
        <p class="section-desc">AI 实时分析您的学习状态</p>
      </div>

      <div class="assessment-panel">
        <div class="assessment-input">
          <label class="assessment-label">当前正确率</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="correctRate" 
              min="0" 
              max="1" 
              step="0.05"
              class="modern-slider"
            />
            <div class="slider-value">{{ Math.round(correctRate * 100) }}%</div>
          </div>
        </div>

        <button class="assessment-btn" @click="onAssess">
          <span class="btn-icon">📊</span>
          开始评估
        </button>

        <div v-if="nextDifficulty" class="assessment-result">
          <div class="result-card">
            <div class="result-icon">🎯</div>
            <div class="result-content">
              <div class="result-title">推荐难度</div>
              <div class="result-value">{{ nextDifficulty }}</div>
              <div class="result-desc">基于您的表现，AI 建议调整难度</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习进度可视化 -->
      <div v-if="store.progress.length" class="progress-visualization">
        <h3 class="viz-title">学习轨迹</h3>
        <div class="chart-container">
          <canvas ref="chartCanvas" width="800" height="300"></canvas>
        </div>
      </div>
    </div>

    <!-- 智能练习系统 -->
    <div class="section-card practice-section">
      <div class="section-header">
        <div class="section-icon">💪</div>
        <h2 class="section-title">AI 练习系统</h2>
        <p class="section-desc">个性化题目推荐与实时反馈</p>
      </div>

      <div class="practice-config">
        <div class="config-group">
          <label class="config-label">练习主题</label>
          <select v-model="practiceTopic" class="modern-select">
            <option v-for="skill in store.skills" :key="skill" :value="skill">
              {{ skill }}
            </option>
          </select>
        </div>

        <div class="config-group">
          <label class="config-label">难度等级</label>
          <div class="difficulty-selector">
            <button 
              v-for="level in levels" 
              :key="level"
              class="difficulty-btn"
              :class="{ active: practiceDifficulty === level }"
              @click="practiceDifficulty = level"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <button class="practice-start-btn" @click="onStartPractice">
          <span class="btn-icon">🚀</span>
          开始练习
        </button>
      </div>

      <!-- 练习题目展示 -->
      <div v-if="questions.length" class="practice-session">
        <div class="session-header">
          <div class="session-info">
            <span class="session-id">练习 #{{ sessionId }}</span>
            <span class="session-progress">{{ answeredCount }}/{{ questions.length }}</span>
          </div>
          <div class="session-timer">
            <span class="timer-icon">⏱️</span>
            <span class="timer-text">{{ formatTime(sessionTime) }}</span>
          </div>
        </div>

        <div class="questions-container">
          <div 
            v-for="(question, index) in questions" 
            :key="question.id"
            class="question-card"
            :class="{ answered: answers[index] !== -1 }"
          >
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-type">{{ question.type }}</span>
            </div>
            <div class="question-content">
              <p class="question-stem">{{ question.stem }}</p>
              <div class="options-grid">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  class="option-item"
                  :class="{ 
                    selected: answers[index] === optIndex,
                    correct: showResults && question.answer === optIndex,
                    wrong: showResults && answers[index] === optIndex && question.answer !== optIndex
                  }"
                  @click="answers[index] = optIndex"
                >
                  <div class="option-marker">{{ String.fromCharCode(65 + optIndex) }}</div>
                  <div class="option-text">{{ option }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="practice-actions">
          <button 
            class="submit-btn" 
            @click="onSubmitPractice"
            :disabled="answeredCount < questions.length"
          >
            <span class="btn-icon">✅</span>
            提交答案
          </button>
        </div>

        <!-- 练习结果 -->
        <div v-if="practiceSummary" class="practice-results">
          <div class="result-card">
            <div class="result-header">
              <div class="result-title">练习完成！</div>
              <div class="result-score">{{ practiceScore }}分</div>
            </div>
            <div class="result-stats">
              <div class="stat-item">
                <span class="stat-label">正确率</span>
                <span class="stat-value">{{ practiceAccuracy }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">用时</span>
                <span class="stat-value">{{ formatTime(sessionTime) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">推荐难度</span>
                <span class="stat-value">{{ nextDifficulty }}</span>
              </div>
            </div>
            <div class="result-summary">
              {{ practiceSummary }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 学习建议 -->
    <div class="section-card ai-suggestions">
      <div class="section-header">
        <div class="section-icon">🤖</div>
        <h2 class="section-title">AI 学习建议</h2>
        <p class="section-desc">基于您的学习数据生成的个性化建议</p>
      </div>

      <div class="suggestions-grid">
        <div class="suggestion-card">
          <div class="suggestion-icon">📈</div>
          <div class="suggestion-content">
            <h3>进度优化</h3>
            <p>建议增加每日学习时间到 2 小时，可提前 3 天完成目标</p>
          </div>
        </div>
        <div class="suggestion-card">
          <div class="suggestion-icon">🎯</div>
          <div class="suggestion-content">
            <h3>重点突破</h3>
            <p>会计基础概念掌握较弱，建议加强相关练习</p>
          </div>
        </div>
        <div class="suggestion-card">
          <div class="suggestion-icon">⚡</div>
          <div class="suggestion-content">
            <h3>效率提升</h3>
            <p>采用番茄工作法可提高 25% 的学习效率</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useLearningStore } from '../stores/learning'
import { ElMessage } from 'element-plus'

const store = useLearningStore()
const levels: Array<'低'|'中'|'高'> = ['低','中','高']
const goalInput = ref('通过 CPA 考试')
const skillsInput = ref('')
const skillsArray = ref(['会计基础', '财务分析', '审计实务'])
const correctRate = ref(0.75)
const nextDifficulty = ref('')
const practiceTopic = ref('会计基础')
const practiceDifficulty = ref<'低'|'中'|'高'>('中')
const sessionId = ref('')
const questions = ref<any[]>([])
const answers = ref<number[]>([])
const practiceSummary = ref('')
const practiceScore = ref(0)
const practiceAccuracy = ref(0)
const showResults = ref(false)
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const sessionTime = ref(0)
const sessionTimer = ref<NodeJS.Timeout | null>(null)
const currentDayIndex = ref(0)

// 计算属性
const answeredCount = computed(() => answers.value.filter(a => a !== -1).length)

// 方法
const addSkill = () => {
  const skill = skillsInput.value.trim()
  if (skill && !skillsArray.value.includes(skill)) {
    skillsArray.value.push(skill)
    skillsInput.value = ''
  }
}

const removeSkill = (skill: string) => {
  const index = skillsArray.value.indexOf(skill)
  if (index > -1) {
    skillsArray.value.splice(index, 1)
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startSessionTimer = () => {
  sessionTime.value = 0
  if (sessionTimer.value) clearInterval(sessionTimer.value)
  sessionTimer.value = setInterval(() => {
    sessionTime.value++
  }, 1000)
}

const stopSessionTimer = () => {
  if (sessionTimer.value) {
    clearInterval(sessionTimer.value)
    sessionTimer.value = null
  }
}

async function onCreateGoal() {
  try {
    await store.createGoal({ 
      goal: goalInput.value, 
      skills: skillsArray.value 
    })
    ElMessage.success('🎯 学习目标已创建，AI 正在为您制定个性化路径...')
  } catch (e) { 
    ElMessage.error('目标创建失败，请重试') 
  }
}

async function onGeneratePlan() {
  try {
    await store.generatePlan(14)
    ElMessage.success('🤖 AI 已生成 14 天学习计划')
    currentDayIndex.value = 0
  } catch (e) { 
    ElMessage.error('计划生成失败') 
  }
}

async function onFetchProgress() {
  try {
    await store.fetchProgress()
    ElMessage.success('📊 学习进度已更新')
  } catch (e) { 
    ElMessage.error('进度获取失败') 
  }
}

async function onAssess() {
  try {
    const res = await store.assess(correctRate.value)
    nextDifficulty.value = res.nextDifficulty || '中'
    ElMessage.success('🧠 AI 评估完成，已调整推荐难度')
  } catch (e) { 
    ElMessage.error('评估失败') 
  }
}

async function onStartPractice() {
  try {
    const res = await store.startSession(practiceTopic.value, practiceDifficulty.value)
    sessionId.value = res.sessionId
    questions.value = res.questions || []
    answers.value = Array.from({ length: questions.value.length }).map(() => -1)
    practiceSummary.value = ''
    showResults.value = false
    startSessionTimer()
    ElMessage.success('🚀 练习已开始，加油！')
  } catch (e) { 
    ElMessage.error('练习生成失败') 
  }
}

async function onSubmitPractice() {
  try {
    const res = await store.submitSession(sessionId.value, answers.value)
    stopSessionTimer()
    showResults.value = true
    nextDifficulty.value = res.nextDifficulty || '中'
    practiceScore.value = res.score || 0
    practiceAccuracy.value = Math.round((res.correctRate ?? 0) * 100)
    practiceSummary.value = `本次练习完成！正确率 ${practiceAccuracy.value}%，获得 ${practiceScore.value} 分`
    ElMessage.success(`✅ 提交成功！正确率 ${practiceAccuracy.value}%`)
  } catch (e) { 
    ElMessage.error('提交失败') 
  }
}

function drawChart() {
  const canvas = chartCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const data = store.progress
  if (!data.length) return

  // 设置画布尺寸
  const padding = 40
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  
  // 计算数据范围
  const maxScore = Math.max(...data.map((d: any) => d.masteryScore))
  const minScore = Math.min(...data.map((d: any) => d.masteryScore))
  const scoreRange = maxScore - minScore || 1
  
  // 绘制网格
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(canvas.width - padding, y)
    ctx.stroke()
  }
  
  // 绘制渐变区域
  const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(padding, canvas.height - padding)
  
  data.forEach((d: any, i: number) => {
    const x = padding + (chartWidth / (data.length - 1)) * i
    const y = padding + chartHeight - ((d.masteryScore - minScore) / scoreRange) * chartHeight
    
    if (i === 0) {
      ctx.lineTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.closePath()
  ctx.fill()
  
  // 绘制线条
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  data.forEach((d: any, i: number) => {
    const x = padding + (chartWidth / (data.length - 1)) * i
    const y = padding + chartHeight - ((d.masteryScore - minScore) / scoreRange) * chartHeight
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // 绘制数据点
  data.forEach((d: any, i: number) => {
    const x = padding + (chartWidth / (data.length - 1)) * i
    const y = padding + chartHeight - ((d.masteryScore - minScore) / scoreRange) * chartHeight
    
    // 外圈
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // 内圈
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  })
}

// 监听数据变化
watch(() => store.progress, () => {
  nextTick(() => {
    drawChart()
  })
}, { deep: true })

watch(() => store.plan, (newPlan) => {
  if (newPlan.length) {
    const today = new Date().toISOString().split('T')[0]
    const todayIndex = newPlan.findIndex((item: any) => item.date === today)
    currentDayIndex.value = todayIndex >= 0 ? todayIndex : 0
  }
}, { deep: true })

onMounted(() => {
  store.fetchProgress()
  nextTick(() => {
    drawChart()
  })
})
</script>

<style scoped>
.learning-container {
  min-height: 100vh;
  background: var(--app-bg);
  position: relative;
  overflow-x: hidden;
}

/* 粒子背景效果 */
.particles-bg {
  display: none;
}

.particle {
  display: none;
}

/* 移除非必要位移动效 */

/* 英雄区域 */
.hero-section {
  position: relative;
  padding: 80px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 40px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  font-weight: 300;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* 通用卡片样式 */
.section-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: saturate(1.2) blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  padding: 40px;
  margin: 0 auto 40px;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  box-shadow: 0 12px 30px rgba(31, 43, 58, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.section-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 目标设置表单 */
.goal-form {
  display: grid;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.input-wrapper {
  position: relative;
}

.modern-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--card-bg-strong);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.modern-input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--card-bg);
}

.input-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.modern-input:focus ~ .input-glow {
  opacity: 0.5;
}

.skills-input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: var(--card-bg-strong);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  min-height: 48px;
  align-items: center;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.remove-btn {
  font-weight: bold;
  opacity: 0.8;
}

.skill-input {
  flex: 1;
  min-width: 120px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn.primary {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  color: #fff;
}

.action-btn.secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-btn.tertiary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 当前目标卡片 */
.current-goal {
  margin-top: 32px;
}

.goal-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.goal-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.goal-content h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 时间轴样式 */
.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-item {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
}

.timeline-marker {
  position: relative;
  width: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  z-index: 2;
}

.timeline-item.active .marker-dot {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-color: #fff;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
}

.timeline-item.completed .marker-dot {
  background: #10b981;
  border-color: #10b981;
}

.marker-line {
  width: 2px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 4px;
}

.timeline-content {
  flex: 1;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-content {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: scale(1.02);
}

.timeline-day {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.timeline-topic {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.timeline-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-skill {
  padding: 4px 12px;
  background: var(--card-bg-strong);
  border-radius: 16px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 评估面板 */
.assessment-panel {
  display: grid;
  gap: 24px;
  margin-bottom: 32px;
}

.assessment-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: block;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.modern-slider {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.modern-slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.slider-value {
  min-width: 60px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
}

.assessment-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(45deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.assessment-btn:hover {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.result-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
}

.result-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.result-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 进度可视化 */
.progress-visualization {
  margin-top: 40px;
}

.viz-title {
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: auto;
}

/* 练习配置 */
.practice-config {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 24px;
  align-items: end;
  margin-bottom: 32px;
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-label {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.modern-select {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.15);
}

.difficulty-selector {
  display: flex;
  gap: 8px;
}

.difficulty-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-btn.active {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  color: #fff;
  border-color: transparent;
}

.practice-start-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(45deg, #f59e0b, #f97316);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
}

.practice-start-btn:hover {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
}

/* 练习会话 */
.practice-session {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.session-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.session-id {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.session-progress {
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  font-size: 0.9rem;
  color: #3b82f6;
  font-weight: 500;
}

.session-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.timer-icon {
  font-size: 1.2rem;
}

.timer-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.question-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.question-card.answered {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.question-type {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.question-stem {
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.6;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.option-item.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.option-item.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.option-item.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.option-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.option-text {
  font-size: 1rem;
  color: #fff;
  line-height: 1.5;
}

.practice-actions {
  display: flex;
  justify-content: center;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(45deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

/* 练习结果 */
.practice-results {
  margin-top: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.result-summary {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* AI 建议 */
.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.suggestion-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.suggestion-card:hover {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.suggestion-icon {
  font-size: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  flex-shrink: 0;
}

.suggestion-content h3 {
  font-size: 1.2rem;
  color: #fff;
  margin: 0 0 8px 0;
}

.suggestion-content p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-divider {
    display: none;
  }
  
  .section-card {
    padding: 24px;
    margin: 0 16px 24px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .practice-config {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 16px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .section-card {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .goal-card {
    flex-direction: column;
    text-align: center;
  }
  
  .timeline-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .timeline-marker {
    flex-direction: row;
    width: auto;
  }
  
  .marker-line {
    width: 40px;
    height: 2px;
    margin: 0 4px;
  }
}
</style>