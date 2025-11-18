const fs = require('fs');
const path = require('path');

// 检查数据文件状态
const dataDir = 'data';
const files = ['profiles.json', 'history.json', 'materials.json', 'friends.json', 'circles.json'];

console.log('=== 数据文件状态检查 ===');
files.forEach(file => {
  const filePath = path.join(dataDir, file);
  try {
    const stats = fs.statSync(filePath);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`✅ ${file}: ${stats.size} bytes, ${Array.isArray(content) ? content.length : Object.keys(content).length} 条记录`);
  } catch (err) {
    console.log(`❌ ${file}: ${err.message}`);
  }
});

console.log('\n=== 用户画像数据概览 ===');
try {
  const profiles = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8'));
  console.log(`总用户数: ${profiles.length}`);
  const sample = profiles[0];
  console.log('样例用户结构:', JSON.stringify(sample, null, 2));
} catch (err) {
  console.log('读取用户数据失败:', err.message);
}

console.log('\n=== 历史记录数据概览 ===');
try {
  const history = JSON.parse(fs.readFileSync('data/history.json', 'utf8'));
  console.log(`总历史记录数: ${history.length}`);
  const sample = history[0];
  console.log('样例历史记录:', JSON.stringify(sample, null, 2));
} catch (err) {
  console.log('读取历史数据失败:', err.message);
}