const crypto = require('crypto')

async function addFile(content) {
  // 占位实现：生成内容哈希模拟 CID
  const hash = crypto.createHash('sha256').update(content).digest('hex')
  return `bafy${hash.slice(0, 46)}`
}

async function getFile(cid) {
  return ''
}

module.exports = { addFile, getFile }
