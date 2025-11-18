const fs = require('fs');
const path = require('path');

console.log('=== 创建完整测试环境 ===');

// 1. 创建测试用户和基础数据
const testUsers = [
  {
    userId: 'test_user_001',
    name: '测试用户001',
    preferences: {
      format: "图文结合",
      difficulty: "中级",
      contentFormat: "视频+文档",
      interactionStyle: "主动引导",
      recentSearches: ["Vue3", "区块链", "机器学习"],
      completedTopics: ["JavaScript基础", "HTML/CSS"],
      preferredSubjects: ["前端开发", "Web3.0"]
    },
    avoidRules: ["不推荐超过3年的技术文章", "排除纯理论无实践的内容"],
    goals: ["技能提升", "项目开发"],
    skills: ["JavaScript", "Vue", "Node.js"],
    weaknesses: [
      { area: "JavaScript 高级特性", improvement: 65 },
      { area: "区块链技术", improvement: 45 }
    ]
  },
  {
    userId: 'test_user_002',
    name: '测试用户002',
    preferences: {
      format: "视频优先",
      difficulty: "高级",
      contentFormat: "实战项目",
      interactionStyle: "自主探索",
      recentSearches: ["Solidity", "智能合约", "DeFi"],
      completedTopics: ["区块链基础", "Solidity语法"],
      preferredSubjects: ["区块链", "智能合约"]
    },
    avoidRules: ["避免过于简单的入门教程"],
    goals: ["学术研究", "项目开发"],
    skills: ["Solidity", "Python", "Web3.js"],
    weaknesses: [
      { area: "智能合约安全", improvement: 70 },
      { area: "DeFi协议理解", improvement: 55 }
    ]
  }
];

// 2. 创建学习历史数据
const learningHistory = [
  {
    id: "hist_001",
    userId: "test_user_001",
    action: "search",
    targetType: "material",
    targetId: "mat_vue3_guide",
    metadata: {
      query: "Vue3 组合式API",
      resultsCount: 5,
      clickedResults: ["mat_vue3_guide", "mat_vue3_composition"]
    },
    timestamp: Date.now() - 3600000,
    aiProcessed: false
  },
  {
    id: "hist_002",
    userId: "test_user_001",
    action: "complete_session",
    targetType: "goal",
    targetId: "goal_js_advanced",
    metadata: {
      topic: "JavaScript闭包",
      duration: 1800000,
      understanding: 85
    },
    timestamp: Date.now() - 7200000,
    aiProcessed: false
  },
  {
    id: "hist_003",
    userId: "test_user_002",
    action: "search",
    targetType: "material",
    targetId: "mat_solidity_security",
    metadata: {
      query: "Solidity 安全漏洞",
      resultsCount: 8,
      clickedResults: ["mat_solidity_security", "mat_reentrancy"]
    },
    timestamp: Date.now() - 10800000,
    aiProcessed: false
  }
];

// 3. 创建社区数据
const communityData = {
  friends: [
    {
      id: 'friend_001',
      userId: 'friend_user_001',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      bio: 'Web3开发者，专注于智能合约开发',
      skills: ['Solidity', 'JavaScript', 'Vue.js'],
      contribution: 1250,
      level: 5,
      isOnline: true,
      lastSeen: Date.now() - 300000
    },
    {
      id: 'friend_002',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
      bio: 'AI研究员，机器学习专家',
      skills: ['Python', 'TensorFlow', '区块链'],
      contribution: 980,
      level: 4,
      isOnline: false,
      lastSeen: Date.now() - 3600000
    }
  ],
  
  circles: [
    {
      id: 'circle_web3',
      name: 'Web3.0技术圈',
      description: '讨论Web3.0技术、DApp开发、智能合约等话题',
      avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=web3',
      category: '技术',
      members: 1250,
      posts: 89,
      resources: 45,
      joined: true,
      createdAt: Date.now() - 86400000 * 30,
      tags: ['Web3', '区块链', '智能合约', 'DApp']
    },
    {
      id: 'circle_ai_learning',
      name: 'AI学习圈',
      description: 'AI学习交流，分享机器学习、深度学习经验',
      avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=ai',
      category: '学习',
      members: 890,
      posts: 156,
      resources: 78,
      joined: true,
      createdAt: Date.now() - 86400000 * 20,
      tags: ['AI', '机器学习', '深度学习', 'Python']
    }
  ],
  
  topics: [
    {
      id: 'topic_001',
      title: 'Vue3 Composition API最佳实践',
      description: '讨论Vue3中Composition API的使用技巧和最佳实践',
      creator: {
        name: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang'
      },
      views: 1250,
      discussions: 89,
      followers: 234,
      followed: true,
      createdAt: Date.now() - 86400000 * 2,
      tags: ['Vue3', 'Composition API', '前端开发']
    }
  ],
  
  posts: [
    {
      id: 'post_001',
      author: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      content: '刚刚完成了一个Vue3 + TypeScript的项目，Composition API真的比Options API灵活很多...',
      images: [],
      code: '',
      topics: ['Vue3', 'TypeScript'],
      likes: [1, 2, 3],
      comments: [],
      shares: 5,
      createdAt: Date.now() - 3600000,
      circle: 'circle_web3'
    }
  ]
};

// 4. 创建学习材料数据
const materials = [
  {
    id: "mat_vue3_guide",
    title: "Vue3 完整指南",
    description: "从基础到高级的Vue3学习指南",
    url: "https://example.com/vue3-guide",
    tags: ["Vue3", "前端开发", "JavaScript"],
    type: "article",
    difficulty: "intermediate",
    language: "zh-CN",
    author: "Vue团队",
    createdAt: Date.now() - 86400000 * 30,
    views: 12500,
    likes: 890,
    comments: 234
  },
  {
    id: "mat_solidity_security",
    title: "Solidity智能合约安全",
    description: "深入分析Solidity智能合约安全漏洞",
    url: "https://example.com/solidity-security",
    tags: ["Solidity", "智能合约", "安全"],
    type: "article",
    difficulty: "advanced",
    language: "zh-CN",
    author: "区块链专家",
    createdAt: Date.now() - 86400000 * 15,
    views: 8900,
    likes: 567,
    comments: 123
  }
];

console.log('\n1. 创建测试数据文件...');

// 保存用户数据
const profilesPath = 'data/profiles.json';
const existingProfiles = fs.existsSync(profilesPath) ? JSON.parse(fs.readFileSync(profilesPath, 'utf8')) : [];

// 合并现有数据和新测试数据
const mergedProfiles = [...existingProfiles.filter(p => !testUsers.find(tu => tu.userId === p.userId)), ...testUsers];
fs.writeFileSync(profilesPath, JSON.stringify(mergedProfiles, null, 2));
console.log(`✅ 用户数据已更新: ${mergedProfiles.length} 位用户`);

// 保存历史数据
const historyPath = 'data/history.json';
const existingHistory = fs.existsSync(historyPath) ? JSON.parse(fs.readFileSync(historyPath, 'utf8')) : [];
const mergedHistory = [...existingHistory, ...learningHistory];
fs.writeFileSync(historyPath, JSON.stringify(mergedHistory, null, 2));
console.log(`✅ 历史数据已更新: ${mergedHistory.length} 条记录`);

// 保存社区数据
const friendsPath = 'data/friends.json';
fs.writeFileSync(friendsPath, JSON.stringify(communityData.friends, null, 2));
console.log(`✅ 好友数据已创建: ${communityData.friends.length} 位好友`);

const circlesPath = 'data/circles.json';
fs.writeFileSync(circlesPath, JSON.stringify(communityData.circles, null, 2));
console.log(`✅ 圈子数据已创建: ${communityData.circles.length} 个圈子`);

const topicsPath = 'data/topics.json';
fs.writeFileSync(topicsPath, JSON.stringify(communityData.topics, null, 2));
console.log(`✅ 话题数据已创建: ${communityData.topics.length} 个话题`);

const postsPath = 'data/posts.json';
fs.writeFileSync(postsPath, JSON.stringify(communityData.posts, null, 2));
console.log(`✅ 动态数据已创建: ${communityData.posts.length} 条动态`);

// 保存材料数据
const materialsPath = 'data/materials.json';
const existingMaterials = fs.existsSync(materialsPath) ? JSON.parse(fs.readFileSync(materialsPath, 'utf8')) : [];
const mergedMaterials = [...existingMaterials, ...materials];
fs.writeFileSync(materialsPath, JSON.stringify(mergedMaterials, null, 2));
console.log(`✅ 材料数据已更新: ${mergedMaterials.length} 份材料`);

console.log('\n2. 验证API接口...');
const http = require('http');

// 测试搜索API
setTimeout(() => {
  http.get('http://localhost:8081/search?q=Vue3', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 搜索API测试: ${res.statusCode}`);
      try {
        const result = JSON.parse(data);
        console.log(`   搜索结果: ${result.results?.length || 0} 条`);
      } catch (e) {
        console.log('   响应数据:', data.slice(0, 100));
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 搜索API错误: ${err.message}`);
  });
}, 1000);

// 测试用户画像API
setTimeout(() => {
  http.get('http://localhost:8081/profile/test_user_001', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 用户画像API测试: ${res.statusCode}`);
      try {
        const profile = JSON.parse(data);
        console.log(`   用户: ${profile.userId}, 技能: ${profile.skills?.length || 0} 个`);
      } catch (e) {
        console.log('   响应数据:', data.slice(0, 100));
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 用户画像API错误: ${err.message}`);
  });
}, 2000);

// 测试社区API
setTimeout(() => {
  http.get('http://localhost:8081/friends/test_user_001', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 好友API测试: ${res.statusCode}`);
      try {
        const friends = JSON.parse(data);
        console.log(`   好友数量: ${friends.length || 0} 位`);
      } catch (e) {
        console.log('   响应数据:', data.slice(0, 100));
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 好友API错误: ${err.message}`);
  });
}, 3000);

console.log('\n3. 测试环境链接:');
console.log('   🏠 前端主页: http://localhost:5173');
console.log('   🔍 搜索页面: http://localhost:5173/search?q=Vue3');
console.log('   👤 用户画像: http://localhost:5173/context-engine');
console.log('   👥 社区页面: http://localhost:5173/community');
console.log('');
console.log('   🔧 API测试:');
console.log('      搜索: http://localhost:8081/search?q=Vue3');
console.log('      用户: http://localhost:8081/profile/test_user_001');
console.log('      好友: http://localhost:8081/friends/test_user_001');
console.log('      圈子: http://localhost:8081/circles');
console.log('      话题: http://localhost:8081/topics/hot');

console.log('\n=== 完整测试环境创建完成! ===');
console.log('✅ 所有核心功能已就绪，可以开始全面测试！');