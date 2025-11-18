const { performance } = require('perf_hooks')

const latency = []

function startTimer() {
  return performance.now()
}

function endTimer(start, label) {
  const ms = performance.now() - start
  latency.push({ label, ms })
  console.log(`[PERF] ${label}: ${ms.toFixed(2)}ms`)
}

function getMetrics() {
  if (!latency.length) return {}
  const sorted = latency.map(l => l.ms).sort((a, b) => a - b)
  const p50 = sorted[Math.floor(sorted.length * 0.5)]
  const p95 = sorted[Math.floor(sorted.length * 0.95)]
  const p99 = sorted[Math.floor(sorted.length * 0.99)]
  return { p50, p95, p99, count: sorted.length }
}

module.exports = { startTimer, endTimer, getMetrics }