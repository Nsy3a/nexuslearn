require('dotenv').config()
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
let ContractClient
let indexMaterial, searchMaterials
let addFile
let startTimer, endTimer, getMetrics
let limiter, authMiddleware
try { ({ ContractClient } = require('../../backend/contractClient')) } catch {
  ContractClient = class {
    constructor() {}
    connectEscrow() {}
    connectNFT() {}
    connectUSDC() {}
    connectGovernor() {}
    connectNEXL() {}
    async createEscrow() { return {} }
    async approveUSDC() { return {} }
    async fundEscrow() { return {} }
    async acceptAndDistribute() { return {} }
    async mintNFT() { return {} }
    async mintNEXL() { return {} }
    async propose() { return { transactionHash: '0x0' } }
    async castVote() { return { transactionHash: '0x0' } }
  }
}
try { ({ indexMaterial, searchMaterials } = require('../../backend/searchService')) } catch {
  indexMaterial = async () => ({})
  searchMaterials = async (q, filters, prefs) => {
    const materials = readJson(files.materials)
    return materials.map(m => ({ ...m, rank: 0.5 }))
  }
}
try { ({ addFile } = require('../../backend/ipfs')) } catch {
  addFile = async (content) => {
    const h = require('crypto').createHash('sha1').update(Buffer.isBuffer(content) ? content : String(content)).digest('hex')
    return h
  }
}
try { ({ startTimer, endTimer, getMetrics } = require('../../backend/performance')) } catch {
  let metrics = { requests: 0, last: [] }
  startTimer = () => Date.now()
  endTimer = (t0, label) => { metrics.requests++; metrics.last.push({ label, ms: Date.now() - t0 }) }
  getMetrics = () => metrics
}
try { ({ limiter, authMiddleware } = require('../../backend/auth')) } catch {
  limiter = () => {}
  authMiddleware = () => {}
}
const { processLearningMaterial } = require('./aiProcessor')

const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545'
const privateKey = process.env.PRIVATE_KEY || '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
const escrowAddress = process.env.ESCROW_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const nftAddress = process.env.NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const usdcAddress = process.env.USDC_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
const governorAddress = process.env.GOVERNOR_ADDRESS || ''
const nexlAddress = process.env.NEXL_ADDRESS || ''

const contractClient = new ContractClient(rpcUrl, privateKey)
contractClient.connectEscrow(escrowAddress)
contractClient.connectNFT(nftAddress)
contractClient.connectUSDC(usdcAddress)
if (governorAddress) contractClient.connectGovernor(governorAddress)
if (nexlAddress) contractClient.connectNEXL(nexlAddress)

const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const files = {
  profiles: path.join(dataDir, 'profiles.json'),
  materials: path.join(dataDir, 'materials.json'),
  demands: path.join(dataDir, 'demands.json'),
  plans: path.join(dataDir, 'plans.json'),
  progress: path.join(dataDir, 'progress.json'),
  answers: path.join(dataDir, 'answers.json'),
  escrows: path.join(dataDir, 'escrows.json'),
  history: path.join(dataDir, 'history.json'),
  nfts: path.join(dataDir, 'nfts.json'),
  friends: path.join(dataDir, 'friends.json'),
  friendPosts: path.join(dataDir, 'friend_posts.json'),
  interestCircles: path.join(dataDir, 'interest_circles.json'),
  circlePosts: path.join(dataDir, 'circle_posts.json'),
  proposals: path.join(dataDir, 'proposals.json'),
  votes: path.join(dataDir, 'votes.json'),
  topics: path.join(dataDir, 'topics.json'),
  topicPosts: path.join(dataDir, 'topic_posts.json'),
  questionBank: path.join(dataDir, 'question_bank.json'),
  sessions: path.join(dataDir, 'sessions.json'),
  mistakes: path.join(dataDir, 'mistakes.json'),
  reinforcement: path.join(dataDir, 'reinforcement.json')
}

Object.values(files).forEach(f => {
  if (!fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify([]))
})

function readJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2))
}

function parseBody(req) {
  return new Promise(resolve => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString()
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        resolve({})
      }
    })
  })
}

function sendJson(res, code, data) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function notFound(res) {
  sendJson(res, 404, { error: 'NOT_FOUND' })
}

function genId(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10)
}

function rankResult(item, prefMatch, quality) {
  const score = 0.6 * prefMatch + 0.4 * quality
  return { ...item, rank: Number(score.toFixed(4)) }
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true)
  const method = req.method
  const pathname = parsed.pathname || '/'
  const t0 = startTimer()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (method === 'POST' && pathname === '/goals') {
    const body = await parseBody(req)
    const profiles = readJson(files.profiles)
    const id = body.userId || genId('user')
    const current = profiles.find(p => p.userId === id) || { userId: id, preferences: {}, avoidRules: [] }
    current.goal = body.goal
    current.skills = body.skills || []
    writeJson(files.profiles, [...profiles.filter(p => p.userId !== id), current])
    sendJson(res, 200, { userId: id, goal: current.goal, skills: current.skills })
    return
  }

  if (method === 'POST' && pathname === '/plans') {
    const body = await parseBody(req)
    const profiles = readJson(files.profiles)
    const id = body.userId
    const profile = profiles.find(p => p.userId === id)
    const days = Number(body.timeBudgetDays || 14)
    const skills = (body.skills && body.skills.length ? body.skills : (profile && profile.skills) || ['基础知识', '练习题', '复盘'])
    const schedule = []
    for (let d = 1; d <= days; d++) {
      const topic = skills[(d - 1) % skills.length]
      schedule.push({ day: d, topic, resources: [], practice: { items: 10, difficulty: '中' } })
    }
    const plans = readJson(files.plans)
    const planId = genId('plan')
    const plan = { planId, userId: id, goal: profile ? profile.goal : body.goal, schedule }
    writeJson(files.plans, [...plans, plan])
    sendJson(res, 200, plan)
    return
  }

  if (method === 'GET' && pathname === '/materials') {
    const materials = readJson(files.materials)
    sendJson(res, 200, { items: materials })
    return
  }

  if (method === 'GET' && pathname.startsWith('/progress/')) {
    const id = pathname.split('/')[2]
    const progress = readJson(files.progress).filter(p => p.userId === id)
    const plans = readJson(files.plans).filter(p => p.userId === id)
    const mastery = progress.length ? progress.reduce((a, b) => a + (b.masteryScore || 0), 0) / progress.length : 0
    sendJson(res, 200, { userId: id, masteryScore: Number(mastery.toFixed(2)), plansCount: plans.length, progress })
    return
  }

  if (method === 'POST' && pathname === '/assess') {
    const body = await parseBody(req)
    const progress = readJson(files.progress)
    const record = { userId: body.userId, correctRate: body.correctRate || 0.7, speed: body.speed || 1, masteryScore: Math.min(100, Math.round((body.correctRate || 0.7) * 100)) }
    writeJson(files.progress, [...progress, record])
    const nextDifficulty = record.correctRate > 0.8 ? '高' : record.correctRate < 0.5 ? '低' : '中'
    sendJson(res, 200, { assessment: record, nextDifficulty })
    return
  }

  if (method === 'POST' && pathname === '/learn/session/start') {
    const body = await parseBody(req)
    const sessions = readJson(files.sessions)
    const bank = readJson(files.questionBank)
    const topic = body.topic || '基础知识'
    const difficulty = body.difficulty || '中'
    const userId = body.userId
    const sessionId = genId('ses')
    const baseQuestions = Array.from({ length: 10 }).map((_, i) => ({
      id: genId('q'),
      topic,
      difficulty,
      stem: `题目${i + 1}：关于${topic}的关键知识点`,
      options: ['A', 'B', 'C', 'D'].map((o, idx) => `${o} 选项${idx + 1}`),
      answer: Math.floor(Math.random() * 4)
    }))
    const questions = baseQuestions
    writeJson(files.sessions, [...sessions, { sessionId, userId, topic, difficulty, questions, createdAt: Date.now() }])
    sendJson(res, 200, { sessionId, questions })
    return
  }

  if (method === 'POST' && pathname === '/learn/session/submit') {
    const body = await parseBody(req)
    const sessions = readJson(files.sessions)
    const mistakes = readJson(files.mistakes)
    const reinforcement = readJson(files.reinforcement)
    const session = sessions.find(s => s.sessionId === body.sessionId)
    if (!session) return notFound(res)
    const answers = body.answers || []
    let correct = 0
    const newMistakes = []
    session.questions.forEach((q, idx) => {
      const ans = answers[idx]
      const isCorrect = Number(ans) === q.answer
      if (isCorrect) correct++
      else newMistakes.push({ userId: session.userId, question: q, chosen: Number(ans), createdAt: Date.now() })
    })
    const correctRate = session.questions.length ? correct / session.questions.length : 0
    const progress = readJson(files.progress)
    const record = { userId: session.userId, correctRate, speed: body.speed || 1, masteryScore: Math.min(100, Math.round(correctRate * 100)) }
    writeJson(files.progress, [...progress, record])
    const nextDifficulty = correctRate > 0.85 ? '高' : correctRate < 0.6 ? '低' : '中'
    const now = Date.now()
    const schedule = newMistakes.map(m => ({
      id: genId('rev'),
      userId: m.userId,
      topic: m.question.topic,
      questionId: m.question.id,
      nextReviewAt: now + 10 * 60 * 1000,
      intervals: [10 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000]
    }))
    writeJson(files.mistakes, [...mistakes, ...newMistakes])
    writeJson(files.reinforcement, [...reinforcement, ...schedule])
    sendJson(res, 200, { correctRate: Number(correctRate.toFixed(2)), nextDifficulty, mistakes: newMistakes.length, reinforcement: schedule })
    return
  }

  if (method === 'GET' && pathname.startsWith('/learn/reinforcement/')) {
    const userId = pathname.split('/')[3] || pathname.split('/')[2]
    const reinforcement = readJson(files.reinforcement)
    const upcoming = reinforcement.filter(r => r.userId === userId).sort((a, b) => a.nextReviewAt - b.nextReviewAt).slice(0, 20)
    sendJson(res, 200, { items: upcoming })
    return
  }

  if (method === 'POST' && pathname === '/ingest/url') {
    const body = await parseBody(req)
    const materials = readJson(files.materials)
    const id = genId('mat')
    
    try {
      // 获取网页内容
      const content = await fetch(body.url).then(r => r.text())
      
      // AI处理内容
      const aiResult = await processLearningMaterial({
        type: 'text',
        content: content,
        url: body.url,
        metadata: body.tags || {}
      }, {
        translate: body.translate || false,
        targetLang: body.targetLang || 'zh-CN',
        checkDuplicates: true,
        existingMaterials: materials
      })
      
      if (!aiResult.success) {
        throw new Error(`AI处理失败: ${aiResult.error}`)
      }
      
      // 生成IPFS哈希
      const ipfsHash = 'ipfs://' + await addFile(aiResult.data.processedText)
      
      // 构建材料项
      const item = {
        id,
        url: body.url,
        respectsRobots: true,
        licenseRisk: aiResult.data.moderation.riskLevel === 'low' ? '低' : '中',
        tags: aiResult.data.metadata,
        qualityScore: aiResult.qualityScore,
        ipfsHash,
        aiProcessing: {
          steps: aiResult.data.processingSteps,
          processingTime: aiResult.processingTime,
          knowledgeGraph: aiResult.data.knowledgeGraph,
          duplicateCheck: aiResult.data.duplicateCheck
        }
      }
      
      writeJson(files.materials, [...materials, item])
      try { await indexMaterial({ 
        material_id: id, 
        url: body.url, 
        filename: '', 
        ipfs_hash: ipfsHash, 
        tags: aiResult.data.metadata, 
        quality_score: aiResult.qualityScore 
      })} catch {}
      
      sendJson(res, 200, item)
    } catch (error) {
      sendJson(res, 400, { error: error.message })
    }
    return
  }

  if (method === 'POST' && pathname === '/ingest/upload') {
    const body = await parseBody(req)
    const storageDir = path.join(__dirname, 'storage')
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })
    const materials = readJson(files.materials)
    const id = genId('mat')
    const filename = body.filename || id + '.bin'
    
    try {
      let content = body.contentBase64 ? Buffer.from(body.contentBase64, 'base64') : Buffer.from('')
      let processedContent = content
      let inputType = 'file'
      
      // 如果是图片文件，进行OCR处理
      if (filename.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
        inputType = 'image'
        const aiResult = await processLearningMaterial({
          type: 'image',
          content: content,
          filename: filename,
          metadata: body.tags || {}
        }, {
          translate: body.translate || false,
          targetLang: body.targetLang || 'zh-CN',
          checkDuplicates: true,
          existingMaterials: materials
        })
        
        if (!aiResult.success) {
          throw new Error(`AI处理失败: ${aiResult.error}`)
        }
        
        processedContent = Buffer.from(aiResult.data.processedText)
      } else {
        // 文本文件直接处理
        const textContent = content.toString('utf-8')
        const aiResult = await processLearningMaterial({
          type: 'text',
          content: textContent,
          filename: filename,
          metadata: body.tags || {}
        }, {
          translate: body.translate || false,
          targetLang: body.targetLang || 'zh-CN',
          checkDuplicates: true,
          existingMaterials: materials
        })
        
        if (!aiResult.success) {
          throw new Error(`AI处理失败: ${aiResult.error}`)
        }
        
        processedContent = Buffer.from(aiResult.data.processedText)
      }
      
      // 保存处理后的文件
      fs.writeFileSync(path.join(storageDir, filename), processedContent)
      
      // 生成IPFS哈希
      const ipfsHash = 'ipfs://' + await addFile(processedContent)
      
      // 构建材料项
      const aiResult = await processLearningMaterial({
        type: inputType,
        content: processedContent,
        filename: filename,
        metadata: body.tags || {}
      })
      
      const item = {
        id,
        filename,
        ipfsHash,
        tags: aiResult.data.metadata,
        qualityScore: aiResult.qualityScore,
        aiProcessing: {
          steps: aiResult.data.processingSteps,
          processingTime: aiResult.processingTime,
          knowledgeGraph: aiResult.data.knowledgeGraph,
          duplicateCheck: aiResult.data.duplicateCheck
        }
      }
      
      writeJson(files.materials, [...materials, item])
      try { await indexMaterial({ 
        material_id: id, 
        url: '', 
        filename, 
        ipfs_hash: ipfsHash, 
        tags: aiResult.data.metadata, 
        quality_score: aiResult.qualityScore 
      })} catch {}
      
      sendJson(res, 200, item)
    } catch (error) {
      sendJson(res, 400, { error: error.message })
    }
    return
  }

  if (method === 'GET' && pathname.startsWith('/materials/')) {
    const id = pathname.split('/')[2]
    const materials = readJson(files.materials)
    const item = materials.find(m => m.id === id)
    if (!item) return notFound(res)
    
    // 如果请求详细AI处理信息
    if (parsed.query.details === 'ai') {
      const enhancedItem = {
        ...item,
        aiAnalysis: {
          processingStatus: item.aiProcessing ? 'completed' : 'basic',
          steps: item.aiProcessing?.steps || [],
          knowledgeGraph: item.aiProcessing?.knowledgeGraph || null,
          qualityAssessment: {
            score: item.qualityScore || 0,
            factors: ['内容完整性', '结构清晰度', '知识密度'],
            recommendations: item.aiProcessing?.knowledgeGraph?.recommendations || []
          }
        }
      }
      sendJson(res, 200, enhancedItem)
    } else {
      sendJson(res, 200, item)
    }
    return
  }

  if (method === 'GET' && pathname.startsWith('/profile/')) {
    const id = pathname.split('/')[2]
    const profiles = readJson(files.profiles)
    const p = profiles.find(x => x.userId === id)
    sendJson(res, 200, p || { userId: id, preferences: {}, avoidRules: [] })
    return
  }

  if (method === 'PUT' && pathname.startsWith('/profile/')) {
    const id = pathname.split('/')[2]
    const body = await parseBody(req)
    const profiles = readJson(files.profiles)
    const current = profiles.find(x => x.userId === id) || { userId: id }
    const updated = { ...current, preferences: body.preferences || current.preferences || {}, avoidRules: body.avoidRules || current.avoidRules || [] }
    writeJson(files.profiles, [...profiles.filter(x => x.userId !== id), updated])
    sendJson(res, 200, updated)
    return
  }

  if (method === 'GET' && pathname.startsWith('/history/')) {
    const id = pathname.split('/')[2]
    const hist = readJson(files.history).filter(h => h.userId === id)
    sendJson(res, 200, { userId: id, entries: hist })
    return
  }

  if (method === 'GET' && pathname === '/search') {
    const q = (parsed.query.q || '').toString().toLowerCase()
    const type = (parsed.query.type || 'mixed').toString()
    const filters = parsed.query.filters ? JSON.parse(parsed.query.filters) : {}
    const materials = readJson(files.materials)
    const profiles = readJson(files.profiles)
    const userId = parsed.query.userId
    const profile = profiles.find(p => p.userId === userId)
    const avoid = (profile && profile.avoidRules) || []
    const prefs = (profile && profile.preferences) || {}
    let results = []
    try {
      const esRes = await searchMaterials(q, filters, prefs)
      results = esRes.filter(m => !avoid.includes(m.tags && m.tags.form))
    } catch {
      results = materials
        .filter(m => !avoid.includes(m.tags && m.tags.form))
        .filter(m => !filters.subject || (m.tags && m.tags.subject === filters.subject))
        .map(m => {
          const text = (m.url || '') + JSON.stringify(m.tags || {})
          const prefMatch = prefs.format && m.tags && m.tags.form === prefs.format ? 1 : text.toLowerCase().includes(q) ? 0.7 : 0.3
          return rankResult(m, prefMatch, m.qualityScore || 0.5)
        })
        .sort((a, b) => b.rank - a.rank)
    }
    const summary = results.slice(0, 10).map(r => ({ id: r.id || r.material_id, url: r.url, rank: r.rank, recommend: '相关度较高' }))
    sendJson(res, 200, { q, type, results: summary })
    return
  }

  if (method === 'POST' && pathname === '/ai/plan') {
    const body = await parseBody(req)
    const skills = body.skills || ['基础知识', '练习题', '复盘']
    const days = Number(body.timeBudgetDays || 7)
    const schedule = []
    for (let d = 1; d <= days; d++) schedule.push({ day: d, topic: skills[(d - 1) % skills.length] })
    sendJson(res, 200, { userId: body.userId, goal: body.goal, schedule })
    return
  }

  if (method === 'POST' && pathname === '/ai/generate') {
    const body = await parseBody(req)
    const type = body.type || 'lecture'
    const content = type === 'exercise' ? { items: 10, difficulty: '中' } : { outline: ['概览', '核心概念', '案例'], depth: '进阶' }
    sendJson(res, 200, { type, content })
    return
  }

  if (method === 'POST' && pathname === '/ai/decompose') {
    const body = await parseBody(req)
    const desc = (body.description || '').toLowerCase()
    const tasks = []
    if (desc.includes('前端')) tasks.push({ id: genId('task'), title: '前端UI', skills: ['Vue3','TypeScript'] })
    if (desc.includes('后端') || desc.includes('api')) tasks.push({ id: genId('task'), title: '后端API', skills: ['Node.js','REST'] })
    if (desc.includes('合约') || desc.includes('链')) tasks.push({ id: genId('task'), title: '合约与链上交互', skills: ['Solidity','Hardhat'] })
    if (!tasks.length) tasks.push({ id: genId('task'), title: '需求分析与原型', skills: ['产品','设计'] })
    sendJson(res, 200, { tasks })
    return
  }

  if (method === 'POST' && pathname === '/demands') {
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const id = genId('dmd')
    const demand = { id, title: body.title, description: body.description, techStack: body.techStack || [], budgetStablecoin: body.budgetStablecoin || 0, tasks: [], status: 'OPEN' }
    writeJson(files.demands, [...demands, demand])
    // 链上创建 escrow
    try {
      await contractClient.createEscrow(id, usdcAddress, demand.budgetStablecoin)
      await contractClient.approveUSDC(escrowAddress, demand.budgetStablecoin)
      await contractClient.fundEscrow(id)
    } catch (e) {
      console.error('Escrow on-chain create/fund failed', e.message)
    }
    const escrows = readJson(files.escrows)
    const escrowId = genId('esc')
    const escrow = { escrowId, demandId: id, token: 'USDC', amount: demand.budgetStablecoin, status: 'CREATED' }
    writeJson(files.escrows, [...escrows, escrow])
    sendJson(res, 200, { demand, escrow })
    return
  }

  if (method === 'GET' && pathname.startsWith('/demands/') && pathname.split('/').length === 3) {
    const id = pathname.split('/')[2]
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    sendJson(res, 200, demand)
    return
  }

  if (method === 'GET' && pathname.startsWith('/demands/') && pathname.endsWith('/progress')) {
    const id = pathname.split('/')[2]
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    const answers = readJson(files.answers).filter(a => a.demandId === id)
    sendJson(res, 200, { demandId: id, status: demand.status, answersCount: answers.length, tasks: demand.tasks })
    return
  }

  if (method === 'POST' && pathname.startsWith('/demands/') && pathname.endsWith('/tasks')) {
    const id = pathname.split('/')[2]
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    const task = { id: genId('task'), title: body.title, skills: body.skills || [], status: 'OPEN', assignee: body.assignee || '', dueDate: body.dueDate || null, dependsOn: body.dependsOn || [], milestone: body.milestone || '', pos: (demand.tasks && demand.tasks.filter(t => t.status === 'OPEN').length) || 0, createdAt: Date.now() }
    demand.tasks = Array.isArray(demand.tasks) ? demand.tasks : []
    demand.tasks.push(task)
    writeJson(files.demands, [...demands.filter(d => d.id !== id), demand])
    sendJson(res, 200, task)
    return
  }

  if (method === 'PUT' && pathname.startsWith('/demands/') && pathname.includes('/tasks/')) {
    const parts = pathname.split('/')
    const id = parts[2]
    const taskId = parts[4]
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    demand.tasks = (demand.tasks || []).map(t => t.id === taskId ? { ...t, status: body.status || t.status, title: body.title || t.title, skills: body.skills || t.skills } : t)
    writeJson(files.demands, [...demands.filter(d => d.id !== id), demand])
    sendJson(res, 200, { updated: true, taskId })
    return
  }

  if (method === 'GET' && pathname.startsWith('/demands/') && pathname.endsWith('/tasks')) {
    const id = pathname.split('/')[2]
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    sendJson(res, 200, { items: demand.tasks || [] })
    return
  }

  if (method === 'POST' && pathname.startsWith('/demands/') && pathname.endsWith('/tasks/reorder')) {
    const id = pathname.split('/')[2]
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    const { taskId, toStatus, toIndex } = body
    const tasks = demand.tasks || []
    const t = tasks.find(x => x.id === taskId)
    if (!t) return notFound(res)
    t.status = toStatus || t.status
    const sameCol = tasks.filter(x => x.status === t.status && x.id !== taskId).sort((a, b) => (a.pos || 0) - (b.pos || 0))
    sameCol.splice(Math.max(0, Math.min(toIndex || 0, sameCol.length)), 0, t)
    sameCol.forEach((x, i) => { x.pos = i })
    writeJson(files.demands, [...demands.filter(d => d.id !== id), { ...demand, tasks }])
    sendJson(res, 200, { reordered: true })
    return
  }

  if (method === 'POST' && pathname.startsWith('/demands/') && pathname.endsWith('/tasks/assign')) {
    const id = pathname.split('/')[2]
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    const tasks = demand.tasks || []
    demand.tasks = tasks.map(t => t.id === body.taskId ? { ...t, assignee: body.assignee || t.assignee } : t)
    writeJson(files.demands, [...demands.filter(d => d.id !== id), demand])
    sendJson(res, 200, { assigned: true })
    return
  }

  if (method === 'POST' && pathname.startsWith('/demands/') && pathname.endsWith('/tasks/dependency')) {
    const id = pathname.split('/')[2]
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    const tasks = demand.tasks || []
    demand.tasks = tasks.map(t => t.id === body.taskId ? { ...t, dependsOn: Array.isArray(body.dependsOn) ? body.dependsOn : t.dependsOn } : t)
    writeJson(files.demands, [...demands.filter(d => d.id !== id), demand])
    sendJson(res, 200, { updated: true })
    return
  }

  if (method === 'POST' && pathname.startsWith('/demands/') && pathname.endsWith('/tasks/milestone')) {
    const id = pathname.split('/')[2]
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === id)
    if (!demand) return notFound(res)
    const tasks = demand.tasks || []
    demand.tasks = tasks.map(t => t.id === body.taskId ? { ...t, dueDate: body.dueDate || t.dueDate, milestone: body.milestone || t.milestone } : t)
    writeJson(files.demands, [...demands.filter(d => d.id !== id), demand])
    sendJson(res, 200, { updated: true })
    return
  }

  if (method === 'POST' && pathname === '/answers') {
    const body = await parseBody(req)
    const answers = readJson(files.answers)
    const id = genId('ans')
    const answer = { id, demandId: body.demandId, contributor: body.contributor, contentUri: body.contentUri || 'ipfs://placeholder', quality: body.quality || 0.8 }
    writeJson(files.answers, [...answers, answer])
    sendJson(res, 200, answer)
    return
  }

  if (method === 'POST' && pathname === '/accept') {
    const body = await parseBody(req)
    const demands = readJson(files.demands)
    const demand = demands.find(d => d.id === body.demandId)
    if (!demand) return notFound(res)
    demand.status = 'ACCEPTED'
    writeJson(files.demands, [...demands.filter(d => d.id !== body.demandId), demand])
    const escrows = readJson(files.escrows)
    const escrow = escrows.find(e => e.demandId === body.demandId)
    if (escrow) {
      escrow.status = 'ACCEPTED'
      escrow.distribution = (body.contributions || []).map(c => ({ address: c.address, share: c.share }))
      writeJson(files.escrows, [...escrows.filter(e => e.demandId !== body.demandId), escrow])
    }
    // 链上 accept 与 mint
    try {
      const contributors = (body.contributions || []).map(c => c.address)
      const shares = (body.contributions || []).map(c => Math.round(c.share * 100))
      await contractClient.acceptAndDistribute(body.demandId, contributors, shares)
      await contractClient.mintNFT(
        '0x0000000000000000000000000000000000000000', // CommunityDAO
        body.contentHash || 'ipfs://placeholder',
        body.summary || '',
        contributors,
        shares,
        body.demandId,
        'https://api.nexuslearn.io/nft/' + body.demandId
      )
      // 铸造 NEXL 奖励（按贡献比例）
      if (nexlAddress) {
        const REWARD = BigInt(1000) * (10n ** 18n)
        for (const c of (body.contributions || [])) {
          const amt = (REWARD * BigInt(Math.round(c.share * 100))) / 100n
          await contractClient.mintNEXL(c.address, amt)
        }
      }
    } catch (e) {
      console.error('On-chain accept/mint failed', e.message)
    }
    const nfts = readJson(files.nfts)
    const nftId = genId('nft')
    const nft = { nftId, demandId: body.demandId, contentHash: body.contentHash || 'ipfs://placeholder', summary: body.summary || '', contributors: escrow && escrow.distribution ? escrow.distribution : [], ownership: 'CommunityDAO', createdAt: Date.now() }
    writeJson(files.nfts, [...nfts, nft])
    sendJson(res, 200, { accepted: true, nft })
    return
  }

  if (method === 'GET' && pathname === '/nfts') {
    const nfts = readJson(files.nfts)
    sendJson(res, 200, { items: nfts })
    return
  }

  if (method === 'GET' && pathname === '/events') {
    const events = readJson(path.join(__dirname, 'data', 'chain_events.json'))
    sendJson(res, 200, { items: events })
    return
  }

  if (method === 'GET' && pathname === '/governance/proposals') {
    const events = readJson(path.join(__dirname, 'data', 'chain_events.json')).filter(e => e.event === 'ProposalCreated')
    sendJson(res, 200, { items: events })
    return
  }

  if (method === 'POST' && pathname === '/governance/propose') {
    const body = await parseBody(req)
    const targets = body.targets || []
    const values = body.values || []
    const calldatas = (body.calldatas || []).map(x => Buffer.from(x.replace(/^0x/, ''), 'hex'))
    const desc = body.description || ''
    try {
      const receipt = await contractClient.propose(targets, values, calldatas, desc)
      sendJson(res, 200, { tx: receipt.transactionHash })
    } catch (e) {
      sendJson(res, 500, { error: 'PROPOSE_FAILED' })
    }
    return
  }

  if (method === 'POST' && pathname === '/governance/vote') {
    const body = await parseBody(req)
    try {
      const receipt = await contractClient.castVote(body.proposalId, body.support)
      sendJson(res, 200, { tx: receipt.transactionHash })
    } catch (e) {
      sendJson(res, 500, { error: 'VOTE_FAILED' })
    }
    return
  }

  if (method === 'GET' && pathname === '/demands') {
    const demands = readJson(files.demands)
    sendJson(res, 200, { items: demands })
    return
  }

  // ===== 朋友圈功能 =====
  // 添加好友
  if (method === 'POST' && pathname === '/friends/add') {
    const body = await parseBody(req)
    const friends = readJson(files.friends)
    const existing = friends.find(f => 
      (f.userId === body.userId && f.friendId === body.friendId) ||
      (f.userId === body.friendId && f.friendId === body.userId)
    )
    if (existing) {
      sendJson(res, 400, { error: '已经是好友关系' })
      return
    }
    const friendRelation = {
      id: genId('friend'),
      userId: body.userId,
      friendId: body.friendId,
      status: 'pending',
      createdAt: Date.now()
    }
    writeJson(files.friends, [...friends, friendRelation])
    sendJson(res, 200, friendRelation)
    return
  }

  // 获取好友列表
  if (method === 'GET' && pathname.startsWith('/friends/')) {
    const userId = pathname.split('/')[2]
    const friends = readJson(files.friends)
    const friendIds = friends
      .filter(f => (f.userId === userId || f.friendId === userId) && f.status === 'accepted')
      .map(f => f.userId === userId ? f.friendId : f.userId)
    sendJson(res, 200, { friends: friendIds })
    return
  }

  // 发布朋友圈动态
  if (method === 'POST' && pathname === '/friends/posts') {
    const body = await parseBody(req)
    const friendPosts = readJson(files.friendPosts)
    const post = {
      id: genId('post'),
      userId: body.userId,
      content: body.content,
      images: body.images || [],
      likes: [],
      comments: [],
      createdAt: Date.now()
    }
    writeJson(files.friendPosts, [...friendPosts, post])
    sendJson(res, 200, post)
    return
  }

  // 获取好友动态
  if (method === 'GET' && pathname.startsWith('/friends/')) {
    const userId = pathname.split('/')[2]
    if (pathname.endsWith('/posts')) {
      const friends = readJson(files.friends)
      const friendIds = friends
        .filter(f => (f.userId === userId || f.friendId === userId) && f.status === 'accepted')
        .map(f => f.userId === userId ? f.friendId : f.userId)
      friendIds.push(userId) // 包含自己的动态
      
      const friendPosts = readJson(files.friendPosts)
      const posts = friendPosts
        .filter(p => friendIds.includes(p.userId))
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 20)
      
      sendJson(res, 200, { posts })
      return
    }
  }

  // 点赞朋友圈动态
  if (method === 'POST' && pathname === '/friends/posts/like') {
    const body = await parseBody(req)
    const friendPosts = readJson(files.friendPosts)
    const post = friendPosts.find(p => p.id === body.postId)
    if (!post) {
      sendJson(res, 404, { error: '动态不存在' })
      return
    }
    if (!post.likes.includes(body.userId)) {
      post.likes.push(body.userId)
      writeJson(files.friendPosts, friendPosts)
    }
    sendJson(res, 200, post)
    return
  }

  // 评论朋友圈动态
  if (method === 'POST' && pathname === '/friends/posts/comment') {
    const body = await parseBody(req)
    const friendPosts = readJson(files.friendPosts)
    const post = friendPosts.find(p => p.id === body.postId)
    if (!post) {
      sendJson(res, 404, { error: '动态不存在' })
      return
    }
    const comment = {
      id: genId('comment'),
      userId: body.userId,
      content: body.content,
      createdAt: Date.now()
    }
    post.comments.push(comment)
    writeJson(files.friendPosts, friendPosts)
    sendJson(res, 200, post)
    return
  }

  // ===== 兴趣圈功能 =====
  // 创建兴趣圈
  if (method === 'POST' && pathname === '/circles') {
    const body = await parseBody(req)
    const interestCircles = readJson(files.interestCircles)
    const circle = {
      id: genId('circle'),
      name: body.name,
      description: body.description,
      category: body.category,
      creator: body.userId,
      members: [body.userId],
      createdAt: Date.now(),
      governance: {
        minStake: body.minStake || 0,
        voteThreshold: body.voteThreshold || 0.51,
        proposalDuration: body.proposalDuration || 7 * 24 * 60 * 60 * 1000 // 7天
      }
    }
    writeJson(files.interestCircles, [...interestCircles, circle])
    sendJson(res, 200, circle)
    return
  }

  // 获取兴趣圈列表
  if (method === 'GET' && pathname === '/circles') {
    const interestCircles = readJson(files.interestCircles)
    sendJson(res, 200, { circles: interestCircles })
    return
  }

  // 加入兴趣圈
  if (method === 'POST' && pathname.startsWith('/circles/') && pathname.endsWith('/join')) {
    const circleId = pathname.split('/')[2]
    const body = await parseBody(req)
    const interestCircles = readJson(files.interestCircles)
    const circle = interestCircles.find(c => c.id === circleId)
    if (!circle) {
      sendJson(res, 404, { error: '兴趣圈不存在' })
      return
    }
    if (circle.members.includes(body.userId)) {
      sendJson(res, 400, { error: '已经是成员' })
      return
    }
    circle.members.push(body.userId)
    writeJson(files.interestCircles, interestCircles)
    sendJson(res, 200, circle)
    return
  }

  // 发布圈子内容
  if (method === 'POST' && pathname.startsWith('/circles/') && pathname.endsWith('/posts')) {
    const circleId = pathname.split('/')[2]
    const body = await parseBody(req)
    const circlePosts = readJson(files.circlePosts)
    const interestCircles = readJson(files.interestCircles)
    const circle = interestCircles.find(c => c.id === circleId)
    if (!circle) {
      sendJson(res, 404, { error: '兴趣圈不存在' })
      return
    }
    if (!circle.members.includes(body.userId)) {
      sendJson(res, 403, { error: '不是圈子成员' })
      return
    }
    const post = {
      id: genId('circle_post'),
      circleId,
      userId: body.userId,
      title: body.title,
      content: body.content,
      type: body.type || 'discussion',
      likes: [],
      comments: [],
      createdAt: Date.now()
    }
    writeJson(files.circlePosts, [...circlePosts, post])
    sendJson(res, 200, post)
    return
  }

  // 获取圈子内容
  if (method === 'GET' && pathname.startsWith('/circles/') && pathname.endsWith('/posts')) {
    const circleId = pathname.split('/')[2]
    const circlePosts = readJson(files.circlePosts)
    const posts = circlePosts
      .filter(p => p.circleId === circleId)
      .sort((a, b) => b.createdAt - a.createdAt)
    sendJson(res, 200, { posts })
    return
  }

  // 创建治理提案
  if (method === 'POST' && pathname.startsWith('/circles/') && pathname.endsWith('/proposals')) {
    const circleId = pathname.split('/')[2]
    const body = await parseBody(req)
    const proposals = readJson(files.proposals)
    const interestCircles = readJson(files.interestCircles)
    const circle = interestCircles.find(c => c.id === circleId)
    if (!circle) {
      sendJson(res, 404, { error: '兴趣圈不存在' })
      return
    }
    if (!circle.members.includes(body.userId)) {
      sendJson(res, 403, { error: '不是圈子成员' })
      return
    }
    const proposal = {
      id: genId('proposal'),
      circleId,
      title: body.title,
      description: body.description,
      proposer: body.userId,
      type: body.type || 'general',
      status: 'active',
      votes: { for: [], against: [], abstain: [] },
      createdAt: Date.now(),
      endAt: Date.now() + circle.governance.proposalDuration
    }
    writeJson(files.proposals, [...proposals, proposal])
    sendJson(res, 200, proposal)
    return
  }

  // 获取圈子提案
  if (method === 'GET' && pathname.startsWith('/circles/') && pathname.endsWith('/proposals')) {
    const circleId = pathname.split('/')[2]
    const proposals = readJson(files.proposals)
    const circleProposals = proposals.filter(p => p.circleId === circleId)
    sendJson(res, 200, { proposals: circleProposals })
    return
  }

  // 投票
  if (method === 'POST' && pathname.startsWith('/proposals/') && pathname.endsWith('/vote')) {
    const proposalId = pathname.split('/')[2]
    const body = await parseBody(req)
    const proposals = readJson(files.proposals)
    const proposal = proposals.find(p => p.id === proposalId)
    if (!proposal) {
      sendJson(res, 404, { error: '提案不存在' })
      return
    }
    if (Date.now() > proposal.endAt) {
      sendJson(res, 400, { error: '投票已结束' })
      return
    }
    // 移除之前的投票
    proposal.votes.for = proposal.votes.for.filter(v => v !== body.userId)
    proposal.votes.against = proposal.votes.against.filter(v => v !== body.userId)
    proposal.votes.abstain = proposal.votes.abstain.filter(v => v !== body.userId)
    // 添加新投票
    proposal.votes[body.vote].push(body.userId)
    writeJson(files.proposals, proposals)
    sendJson(res, 200, proposal)
    return
  }

  // ===== 话题圈功能 =====
  // 创建话题
  if (method === 'POST' && pathname === '/topics') {
    const body = await parseBody(req)
    const topics = readJson(files.topics)
    const topic = {
      id: genId('topic'),
      title: body.title,
      description: body.description,
      category: body.category,
      creator: body.userId,
      participants: [body.userId],
      posts: 0,
      heat: 1, // 热度初始值
      status: 'active',
      createdAt: Date.now(),
      endAt: Date.now() + (body.duration || 7 * 24 * 60 * 60 * 1000) // 默认7天
    }
    writeJson(files.topics, [...topics, topic])
    sendJson(res, 200, topic)
    return
  }

  // 获取话题列表
  if (method === 'GET' && pathname === '/topics') {
    const topics = readJson(files.topics)
    const activeTopics = topics
      .filter(t => t.status === 'active' && Date.now() < t.endAt)
      .sort((a, b) => b.heat - a.heat) // 按热度排序
    sendJson(res, 200, { topics: activeTopics })
    return
  }

  // 获取热门话题
  if (method === 'GET' && pathname === '/topics/hot') {
    const topics = readJson(files.topics)
    const hotTopics = topics
      .filter(t => t.status === 'active' && Date.now() < t.endAt)
      .sort((a, b) => b.heat - a.heat)
      .slice(0, 10) // 前10个热门话题
    sendJson(res, 200, { topics: hotTopics })
    return
  }

  // 参与话题讨论
  if (method === 'POST' && pathname.startsWith('/topics/') && pathname.endsWith('/posts')) {
    const topicId = pathname.split('/')[2]
    const body = await parseBody(req)
    const topics = readJson(files.topics)
    const topicPosts = readJson(files.topicPosts)
    const topic = topics.find(t => t.id === topicId)
    if (!topic) {
      sendJson(res, 404, { error: '话题不存在' })
      return
    }
    if (Date.now() > topic.endAt) {
      sendJson(res, 400, { error: '话题已结束' })
      return
    }
    
    const post = {
      id: genId('topic_post'),
      topicId,
      userId: body.userId,
      content: body.content,
      images: body.images || [],
      likes: [],
      replies: [],
      createdAt: Date.now()
    }
    
    // 更新话题参与者和热度
    if (!topic.participants.includes(body.userId)) {
      topic.participants.push(body.userId)
    }
    topic.posts += 1
    topic.heat += 0.5 // 增加热度
    
    writeJson(files.topics, topics)
    writeJson(files.topicPosts, [...topicPosts, post])
    sendJson(res, 200, post)
    return
  }

  // 获取话题讨论
  if (method === 'GET' && pathname.startsWith('/topics/') && pathname.endsWith('/posts')) {
    const topicId = pathname.split('/')[2]
    const topicPosts = readJson(files.topicPosts)
    const posts = topicPosts
      .filter(p => p.topicId === topicId)
      .sort((a, b) => b.createdAt - a.createdAt)
    sendJson(res, 200, { posts })
    return
  }

  // 点赞话题讨论
  if (method === 'POST' && pathname.startsWith('/topics/posts/') && pathname.endsWith('/like')) {
    const postId = pathname.split('/')[3]
    const body = await parseBody(req)
    const topicPosts = readJson(files.topicPosts)
    const post = topicPosts.find(p => p.id === postId)
    if (!post) {
      sendJson(res, 404, { error: '讨论不存在' })
      return
    }
    if (!post.likes.includes(body.userId)) {
      post.likes.push(body.userId)
      // 增加话题热度
      const topics = readJson(files.topics)
      const topic = topics.find(t => t.id === post.topicId)
      if (topic) {
        topic.heat += 0.2
        writeJson(files.topics, topics)
      }
      writeJson(files.topicPosts, topicPosts)
    }
    sendJson(res, 200, post)
    return
  }

  // 回复话题讨论
  if (method === 'POST' && pathname.startsWith('/topics/posts/') && pathname.endsWith('/reply')) {
    const postId = pathname.split('/')[3]
    const body = await parseBody(req)
    const topicPosts = readJson(files.topicPosts)
    const post = topicPosts.find(p => p.id === postId)
    if (!post) {
      sendJson(res, 404, { error: '讨论不存在' })
      return
    }
    const reply = {
      id: genId('reply'),
      userId: body.userId,
      content: body.content,
      createdAt: Date.now()
    }
    post.replies.push(reply)
    // 增加话题热度
    const topics = readJson(files.topics)
    const topic = topics.find(t => t.id === post.topicId)
    if (topic) {
      topic.heat += 0.3
      writeJson(files.topics, topics)
    }
    writeJson(files.topicPosts, topicPosts)
    sendJson(res, 200, post)
    return
  }

  if (method === 'GET' && pathname === '/ui') {
    const uiPath = path.join(__dirname, '../frontend/index.html')
    if (!fs.existsSync(uiPath)) return notFound(res)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(fs.readFileSync(uiPath))
    return
  }

  if (method === 'GET' && pathname === '/ui/app.js') {
    const jsPath = path.join(__dirname, '../frontend/app.js')
    if (!fs.existsSync(jsPath)) return notFound(res)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/javascript')
    res.end(fs.readFileSync(jsPath))
    return
  }

  if (method === 'GET' && pathname === '/metrics') {
    const m = getMetrics()
    sendJson(res, 200, m)
    return
  }

  notFound(res)
  endTimer(t0, `${method} ${pathname}`)
})

// 速率限制中间件（基础防护）禁用（非Express环境）

const PORT = process.env.PORT || 8081
server.listen(PORT, () => {})
