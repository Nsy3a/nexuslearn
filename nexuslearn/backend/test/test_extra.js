const base = 'http://localhost:8080'

async function json(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(method + ' ' + path + ' ' + res.status)
  return res.json()
}

async function get(path) {
  const res = await fetch(base + path)
  if (!res.ok) throw new Error('GET ' + path + ' ' + res.status)
  return res.text()
}

async function run() {
  const up = await json('POST', '/ingest/upload', { filename: 'doc.txt', contentBase64: 'SGVsbG8gTmV4dXNMZWFybg==', tags: { density: '入门', subject: '通用', form: '理论' } })
  const mats = await json('GET', '/materials')
  const aiPlan = await json('POST', '/ai/plan', { userId: 'u2', goal: 'ML', skills: ['线性代数','概率'], timeBudgetDays: 4 })
  const aiGen = await json('POST', '/ai/generate', { type: 'exercise', goal: 'ML' })
  const ui = await get('/ui')
  const ok = {
    upload: up.filename === 'doc.txt',
    materials: Array.isArray(mats.items) && mats.items.length >= 1,
    ai: Array.isArray(aiPlan.schedule) && aiPlan.schedule.length === 4,
    gen: aiGen.type === 'exercise',
    ui: ui.includes('<title>NexusLearn MVP</title>')
  }
  const allOk = Object.values(ok).every(Boolean)
  if (!allOk) {
    console.error('FAILED', ok)
    process.exit(1)
  }
  console.log('OK_EXTRA', ok)
}

run().catch(e => { console.error(e); process.exit(1) })

