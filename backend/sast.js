const { execSync } = require('child_process')

function runSast() {
  try {
    execSync('npx eslint . --ext .js,.ts --max-warnings 0', { stdio: 'inherit' })
    console.log('✅ SAST passed')
  } catch (e) {
    console.error('❌ SAST failed')
    process.exit(1)
  }
}

function runDast() {
  // 占位：集成 OWASP ZAP 或类似工具
  console.log('🚧 DAST placeholder')
}

module.exports = { runSast, runDast }