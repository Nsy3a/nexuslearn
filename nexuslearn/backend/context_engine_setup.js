const fs = require('fs');
const path = require('path');

// 创建测试用户数据
const testUserId = 'test_user_001';
const testData = {
  profile: {
    userId: testUserId,
    preferences: {
      format: "图文结合",
      difficulty: "中级",
      contentFormat: "视频+文档",
      interactionStyle: "主动引导",
      recentSearches: ["Vue3", "区块链", "机器学习"],
      completedTopics: ["JavaScript基础", "HTML/CSS"],
      preferredSubjects: ["前端开发", "Web3.0"]
    },
    avoidRules: [
      "不推荐超过3年的技术文章",
      "排除纯理论无实践的内容"
    ],
    goals: ["技能提升", "项目开发"],
    weaknesses: [
      { area: "JavaScript 高级特性", improvement: 65 },
      { area: "区块链技术", improvement: 45 }
    ],
    skills: ["JavaScript", "Vue", "Node.js"]
  },
  
  history: [
    {
      id: "hist_test_001",
      userId: testUserId,
      action: "search",
      targetType: "material",
      targetId: "mat_vue3_guide",
      metadata: {
        query: "Vue3 组合式API",
        resultsCount: 5,
        clickedResults: ["mat_vue3_guide", "mat_vue3_composition"]
      },
      timestamp: Date.now() - 3600000, // 1小时前
      aiProcessed: false
    },
    {
      id: "hist_test_002", 
      userId: testUserId,
      action: "complete_session",
      targetType: "goal",
      targetId: "goal_js_advanced",
      metadata: {
        topic: "JavaScript闭包",
        duration: 1800000, // 30分钟
        understanding: 85
      },
      timestamp: Date.now() - 7200000, // 2小时前
      aiProcessed: false
    },
    {
      id: "hist_test_003",
      userId: testUserId, 
      action: "like_material",
      targetType: "material",
      targetId: "mat_blockchain_intro",
      metadata: {
        subject: "区块链基础",
        rating: 5,
        comment: "内容很详细，适合初学者"
      },
      timestamp: Date.now() - 10800000, // 3小时前
      aiProcessed: false
    }
  ]
};

console.log('=== 开始ContextEngine真实数据接入测试 ===');

// 1. 检查当前数据文件
console.log('\n1. 检查现有数据...');
try {
  const profilesPath = 'data/profiles.json';
  const historyPath = 'data/history.json';
  
  let profiles = [];
  let history = [];
  
  if (fs.existsSync(profilesPath)) {
    profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    console.log(`✅ 现有用户数据: ${profiles.length} 条`);
  }
  
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    console.log(`✅ 现有历史数据: ${history.length} 条`);
  }
  
  // 2. 添加测试数据
  console.log('\n2. 添加测试用户数据...');
  
  // 检查是否已存在测试用户
  const existingUserIndex = profiles.findIndex(p => p.userId === testUserId);
  if (existingUserIndex !== -1) {
    profiles[existingUserIndex] = testData.profile;
    console.log(`🔄 更新现有测试用户: ${testUserId}`);
  } else {
    profiles.push(testData.profile);
    console.log(`✅ 添加新测试用户: ${testUserId}`);
  }
  
  // 添加历史记录
  testData.history.forEach(hist => {
    const existingHistIndex = history.findIndex(h => h.id === hist.id);
    if (existingHistIndex !== -1) {
      history[existingHistIndex] = hist;
      console.log(`🔄 更新历史记录: ${hist.id}`);
    } else {
      history.push(hist);
      console.log(`✅ 添加历史记录: ${hist.id}`);
    }
  });
  
  // 3. 保存数据
  console.log('\n3. 保存数据到文件...');
  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
  console.log('✅ 用户数据已保存');
  
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  console.log('✅ 历史数据已保存');
  
  // 4. 验证API接口
  console.log('\n4. 验证API接口...');
  const http = require('http');
  
  // 测试用户画像API
  http.get('http://localhost:8081/profile/test_user_001', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 用户画像API测试: ${res.statusCode}`);
      if (res.statusCode === 200) {
        const profile = JSON.parse(data);
        console.log(`   用户ID: ${profile.userId}`);
        console.log(`   偏好: ${JSON.stringify(profile.preferences)}`);
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 用户画像API错误: ${err.message}`);
  });
  
  // 5. 输出测试链接
  console.log('\n5. ContextEngine测试链接:');
  console.log(`   前端页面: http://localhost:5173/context-engine`);
  console.log(`   API测试: http://localhost:8081/profile/test_user_001`);
  console.log(`   历史记录: http://localhost:8081/history/test_user_001`);
  
  console.log('\n=== ContextEngine真实数据接入完成! ===');
  
} catch (error) {
  console.error('❌ 数据接入失败:', error.message);
}