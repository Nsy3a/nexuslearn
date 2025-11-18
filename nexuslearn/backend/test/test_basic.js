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
  return res.json()
}

async function run() {
  const userId = 'u1'
  const g = await json('POST', '/goals', { userId, goal: 'CPA', skills: ['会计基础', '练习题', '复盘'] })
  const p = await json('POST', '/plans', { userId, timeBudgetDays: 3 })
  const prof = await json('PUT', '/profile/' + userId, { preferences: { format: '理论' }, avoidRules: ['案例'] })
  const mat = await json('POST', '/ingest/url', { url: 'https://example.com/doc', tags: { density: '进阶', subject: '会计', form: '理论' } })
  const filters = encodeURIComponent(JSON.stringify({ subject: '会计' }))
  const sr = await get('/search?q=' + encodeURIComponent('会计') + '&userId=' + userId + '&filters=' + filters)
  const dm = await json('POST', '/demands', { title: '生成前端登录页', description: 'Vue3 方案', techStack: ['Vue3'], budgetStablecoin: 100 })
  const ans = await json('POST', '/answers', { demandId: dm.demand.id, contributor: '0xabc', contentUri: 'ipfs://Qm123', quality: 0.9 })
  const ac = await json('POST', '/accept', { demandId: dm.demand.id, contributions: [{ address: '0xabc', share: 1.0 }], contentHash: 'ipfs://QmWork', summary: '登录方案' })
  const pr = await get('/demands/' + dm.demand.id + '/progress')
  const ok = {
    goals: g.userId === userId,
    plans: Array.isArray(p.schedule) && p.schedule.length === 3,
    profile: prof.preferences && prof.preferences.format === '理论',
    search: Array.isArray(sr.results) && sr.results.length >= 1,
    demand: dm.escrow && dm.escrow.status === 'CREATED',
    accept: ac.accepted === true && ac.nft && ac.nft.ownership === 'CommunityDAO',
    progress: pr.answersCount >= 1
  }
  const allOk = Object.values(ok).every(Boolean)
  if (!allOk) {
    console.error('FAILED', ok)
    process.exit(1)
  }
  console.log('OK', ok)
}

run().catch(e => { console.error(e); process.exit(1) })

