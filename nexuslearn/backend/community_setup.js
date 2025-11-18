const fs = require('fs');
const path = require('path');

// 创建社区测试数据
const testUserId = 'test_user_001';
const testData = {
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
      lastSeen: Date.now() - 300000 // 5分钟前
    },
    {
      id: 'friend_002', 
      userId: 'friend_user_002',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
      bio: 'AI研究员，机器学习专家',
      skills: ['Python', 'TensorFlow', '区块链'],
      contribution: 980,
      level: 4,
      isOnline: false,
      lastSeen: Date.now() - 3600000 // 1小时前
    },
    {
      id: 'friend_003',
      userId: 'friend_user_003', 
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
      bio: '前端工程师，Vue.js爱好者',
      skills: ['Vue.js', 'TypeScript', 'Web3'],
      contribution: 750,
      level: 3,
      isOnline: true,
      lastSeen: Date.now() - 600000 // 10分钟前
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
      createdAt: Date.now() - 86400000 * 30, // 30天前
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
      createdAt: Date.now() - 86400000 * 20, // 20天前
      tags: ['AI', '机器学习', '深度学习', 'Python']
    },
    {
      id: 'circle_frontend',
      name: '前端开发圈',
      description: '前端技术交流，Vue.js、React、Angular讨论',
      avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=frontend',
      category: '技术',
      members: 2100,
      posts: 234,
      resources: 123,
      joined: false,
      createdAt: Date.now() - 86400000 * 45, // 45天前
      tags: ['前端', 'Vue.js', 'React', 'JavaScript']
    }
  ],
  
  topics: [
    {
      id: 'topic_001',
      title: 'Vue3 Composition API最佳实践',
      description: '讨论Vue3中Composition API的使用技巧和最佳实践，分享实际项目经验',
      creator: {
        name: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang'
      },
      views: 1250,
      discussions: 89,
      followers: 234,
      followed: true,
      createdAt: Date.now() - 86400000 * 2, // 2天前
      tags: ['Vue3', 'Composition API', '前端开发'],
      lastActivity: Date.now() - 3600000 // 1小时前
    },
    {
      id: 'topic_002',
      title: 'Solidity智能合约安全漏洞分析',
      description: '深入分析Solidity智能合约常见的安全漏洞，学习如何编写安全的智能合约',
      creator: {
        name: '李四',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li'
      },
      views: 890,
      discussions: 56,
      followers: 167,
      followed: false,
      createdAt: Date.now() - 86400000 * 5, // 5天前
      tags: ['Solidity', '智能合约', '安全', 'Web3'],
      lastActivity: Date.now() - 7200000 // 2小时前
    }
  ],
  
  posts: [
    {
      id: 'post_001',
      author: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      content: '刚刚完成了一个Vue3 + TypeScript的项目，Composition API真的比Options API灵活很多，特别是在逻辑复用方面。分享一些心得体会...',
      images: [],
      code: '',
      topics: ['Vue3', 'TypeScript'],
      likes: [1, 2, 3], // 用户ID列表
      comments: [
        {
          id: 'comment_001',
          author: '李四',
          content: '说得很对，Composition API在大型项目中优势明显',
          createdAt: Date.now() - 1800000 // 30分钟前
        }
      ],
      shares: 5,
      createdAt: Date.now() - 3600000, // 1小时前
      circle: 'circle_web3'
    },
    {
      id: 'post_002',
      author: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
      content: '最近在研究Web3.js和Ethers.js的区别，发现Ethers.js的API设计更加现代化，使用起来也更直观。大家有什么经验可以分享吗？',
      images: [],
      code: '// Ethers.js示例\nconst provider = new ethers.providers.Web3Provider(window.ethereum);\nconst signer = provider.getSigner();',
      topics: ['Web3.js', 'Ethers.js', '区块链'],
      likes: [2, 4],
      comments: [],
      shares: 3,
      createdAt: Date.now() - 7200000, // 2小时前
      circle: 'circle_web3'
    }
  ]
};

console.log('=== 开始Community.vue生态对接测试 ===');

// 1. 创建社区数据文件
console.log('\n1. 创建社区数据文件...');
const dataDir = 'data';

// 创建好友数据文件
const friendsPath = path.join(dataDir, 'friends.json');
fs.writeFileSync(friendsPath, JSON.stringify(testData.friends, null, 2));
console.log(`✅ 好友数据已创建: ${testData.friends.length} 位好友`);

// 创建圈子数据文件
const circlesPath = path.join(dataDir, 'circles.json');
fs.writeFileSync(circlesPath, JSON.stringify(testData.circles, null, 2));
console.log(`✅ 圈子数据已创建: ${testData.circles.length} 个圈子`);

// 创建话题数据文件
const topicsPath = path.join(dataDir, 'topics.json');
fs.writeFileSync(topicsPath, JSON.stringify(testData.topics, null, 2));
console.log(`✅ 话题数据已创建: ${testData.topics.length} 个话题`);

// 创建动态数据文件
const postsPath = path.join(dataDir, 'posts.json');
fs.writeFileSync(postsPath, JSON.stringify(testData.posts, null, 2));
console.log(`✅ 动态数据已创建: ${testData.posts.length} 条动态`);

// 2. 验证API接口
console.log('\n2. 验证API接口...');
const http = require('http');

// 测试好友API
setTimeout(() => {
  http.get('http://localhost:8081/friends/test_user_001', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 好友API测试: ${res.statusCode}`);
      if (res.statusCode === 200) {
        try {
          const friends = JSON.parse(data);
          console.log(`   好友数量: ${friends.length}`);
        } catch (e) {
          console.log('   响应数据:', data.slice(0, 100));
        }
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 好友API错误: ${err.message}`);
  });
}, 1000);

// 测试圈子API
setTimeout(() => {
  http.get('http://localhost:8081/circles', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 圈子API测试: ${res.statusCode}`);
      if (res.statusCode === 200) {
        try {
          const circles = JSON.parse(data);
          console.log(`   圈子数量: ${circles.circles?.length || 0}`);
        } catch (e) {
          console.log('   响应数据:', data.slice(0, 100));
        }
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 圈子API错误: ${err.message}`);
  });
}, 2000);

// 测试话题API
setTimeout(() => {
  http.get('http://localhost:8081/topics/hot', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ 话题API测试: ${res.statusCode}`);
      if (res.statusCode === 200) {
        try {
          const topics = JSON.parse(data);
          console.log(`   话题数量: ${topics.topics?.length || 0}`);
        } catch (e) {
          console.log('   响应数据:', data.slice(0, 100));
        }
      }
    });
  }).on('error', (err) => {
    console.log(`❌ 话题API错误: ${err.message}`);
  });
}, 3000);

// 3. 输出测试链接
setTimeout(() => {
  console.log('\n3. Community.vue测试链接:');
  console.log(`   前端页面: http://localhost:5173/community`);
  console.log(`   好友API: http://localhost:8081/friends/test_user_001`);
  console.log(`   圈子API: http://localhost:8081/circles`);
  console.log(`   话题API: http://localhost:8081/topics/hot`);
  console.log(`   动态API: http://localhost:8081/friends/posts`);
  
  console.log('\n=== Community.vue生态对接完成! ===');
}, 4000);