const fs = require('fs')
const path = require('path')

// 生成唯一ID
function genId(prefix) {
  return prefix + '_' + Math.random().toString(36).substr(2, 9)
}

// 朋友圈功能
class FriendCircle {
  constructor(dataDir) {
    this.dataDir = dataDir
    this.friendsFile = path.join(dataDir, 'friends.json')
    this.postsFile = path.join(dataDir, 'friend_posts.json')
    this.commentsFile = path.join(dataDir, 'friend_comments.json')
    this.likesFile = path.join(dataDir, 'friend_likes.json')
    
    this.initFiles()
  }
  
  initFiles() {
    [this.friendsFile, this.postsFile, this.commentsFile, this.likesFile].forEach(file => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([]))
      }
    })
  }
  
  readJson(file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8') || '[]')
    } catch {
      return []
    }
  }
  
  writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  }
  
  // 添加好友
  addFriend(userId, friendId, relationship = 'friend') {
    const friends = this.readJson(this.friendsFile)
    const existing = friends.find(f => 
      (f.userId === userId && f.friendId === friendId) ||
      (f.userId === friendId && f.friendId === userId)
    )
    
    if (existing) {
      return { success: false, message: '已经是好友关系' }
    }
    
    const friend = {
      id: genId('friend'),
      userId,
      friendId,
      relationship,
      createdAt: new Date().toISOString(),
      status: 'accepted'
    }
    
    friends.push(friend)
    this.writeJson(this.friendsFile, friends)
    
    return { success: true, friend }
  }
  
  // 获取好友列表
  getFriends(userId) {
    const friends = this.readJson(this.friendsFile)
    return friends.filter(f => 
      (f.userId === userId || f.friendId === userId) && f.status === 'accepted'
    )
  }
  
  // 发布朋友圈动态
  createPost(userId, content, images = [], privacy = 'friends') {
    const post = {
      id: genId('post'),
      userId,
      content,
      images,
      privacy,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0
    }
    
    const posts = this.readJson(this.postsFile)
    posts.unshift(post)
    this.writeJson(this.postsFile, posts)
    
    return post
  }
  
  // 获取朋友圈动态
  getFriendPosts(userId, page = 1, limit = 20) {
    const friends = this.getFriends(userId)
    const friendIds = friends.map(f => f.userId === userId ? f.friendId : f.userId)
    friendIds.push(userId) // 包含自己的动态
    
    const posts = this.readJson(this.postsFile)
    const friendPosts = posts.filter(p => friendIds.includes(p.userId) && p.privacy !== 'private')
    
    // 按时间倒序排序
    friendPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    const start = (page - 1) * limit
    const end = start + limit
    
    return {
      posts: friendPosts.slice(start, end),
      total: friendPosts.length,
      page,
      totalPages: Math.ceil(friendPosts.length / limit)
    }
  }
  
  // 点赞
  likePost(userId, postId) {
    const likes = this.readJson(this.likesFile)
    const existing = likes.find(l => l.userId === userId && l.postId === postId)
    
    if (existing) {
      // 取消点赞
      const newLikes = likes.filter(l => !(l.userId === userId && l.postId === postId))
      this.writeJson(this.likesFile, newLikes)
      this.updatePostStats(postId, -1, 0, 0)
      return { success: true, action: 'unliked' }
    } else {
      // 点赞
      likes.push({
        id: genId('like'),
        userId,
        postId,
        createdAt: new Date().toISOString()
      })
      this.writeJson(this.likesFile, likes)
      this.updatePostStats(postId, 1, 0, 0)
      return { success: true, action: 'liked' }
    }
  }
  
  // 评论
  commentPost(userId, postId, content) {
    const comment = {
      id: genId('comment'),
      userId,
      postId,
      content,
      createdAt: new Date().toISOString()
    }
    
    const comments = this.readJson(this.commentsFile)
    comments.unshift(comment)
    this.writeJson(this.commentsFile, comments)
    
    this.updatePostStats(postId, 0, 1, 0)
    return comment
  }
  
  // 更新动态统计
  updatePostStats(postId, likesDelta, commentsDelta, sharesDelta) {
    const posts = this.readJson(this.postsFile)
    const post = posts.find(p => p.id === postId)
    if (post) {
      post.likes = Math.max(0, (post.likes || 0) + likesDelta)
      post.comments = Math.max(0, (post.comments || 0) + commentsDelta)
      post.shares = Math.max(0, (post.shares || 0) + sharesDelta)
      this.writeJson(this.postsFile, posts)
    }
  }
}

// 兴趣圈(DAO)功能
class InterestCircle {
  constructor(dataDir) {
    this.dataDir = dataDir
    this.circlesFile = path.join(dataDir, 'interest_circles.json')
    this.membersFile = path.join(dataDir, 'circle_members.json')
    this.circlePostsFile = path.join(dataDir, 'circle_posts.json')
    this.proposalsFile = path.join(dataDir, 'circle_proposals.json')
    
    this.initFiles()
  }
  
  initFiles() {
    [this.circlesFile, this.membersFile, this.circlePostsFile, this.proposalsFile].forEach(file => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([]))
      }
    })
  }
  
  readJson(file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8') || '[]')
    } catch {
      return []
    }
  }
  
  writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  }
  
  // 创建兴趣圈
  createCircle(creatorId, name, description, category, tags = []) {
    const circle = {
      id: genId('circle'),
      creatorId,
      name,
      description,
      category,
      tags,
      memberCount: 1,
      postCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      settings: {
        joinMode: 'public', // public, private, invite
        postMode: 'member', // member, moderator
        voteThreshold: 0.51 // 投票通过阈值
      }
    }
    
    const circles = this.readJson(this.circlesFile)
    circles.push(circle)
    this.writeJson(this.circlesFile, circles)
    
    // 创建者自动成为成员
    this.joinCircle(creatorId, circle.id, 'creator')
    
    return circle
  }
  
  // 加入兴趣圈
  joinCircle(userId, circleId, role = 'member') {
    const members = this.readJson(this.membersFile)
    const existing = members.find(m => m.userId === userId && m.circleId === circleId)
    
    if (existing) {
      return { success: false, message: '已经是成员' }
    }
    
    const member = {
      id: genId('member'),
      userId,
      circleId,
      role, // creator, admin, moderator, member
      joinedAt: new Date().toISOString(),
      contributionScore: 0,
      reputation: 0
    }
    
    members.push(member)
    this.writeJson(this.membersFile, members)
    
    // 更新圈子成员数
    this.updateCircleStats(circleId, 1, 0)
    
    return { success: true, member }
  }
  
  // 获取用户加入的兴趣圈
  getUserCircles(userId) {
    const members = this.readJson(this.membersFile)
    const circles = this.readJson(this.circlesFile)
    
    const userMember = members.filter(m => m.userId === userId)
    return userMember.map(m => {
      const circle = circles.find(c => c.id === m.circleId)
      return { ...circle, memberRole: m.role, contributionScore: m.contributionScore }
    }).filter(Boolean)
  }
  
  // 发布圈子内容
  createCirclePost(userId, circleId, title, content, type = 'discussion') {
    const members = this.readJson(this.membersFile)
    const member = members.find(m => m.userId === userId && m.circleId === circleId)
    
    if (!member) {
      return { success: false, message: '不是圈子成员' }
    }
    
    const post = {
      id: genId('circle_post'),
      circleId,
      userId,
      title,
      content,
      type, // discussion, question, resource, announcement
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isPinned: false,
      isLocked: false
    }
    
    const posts = this.readJson(this.circlePostsFile)
    posts.unshift(post)
    this.writeJson(this.circlePostsFile, posts)
    
    // 更新圈子统计
    this.updateCircleStats(circleId, 0, 1)
    
    return { success: true, post }
  }
  
  // 创建提案（治理功能）
  createProposal(userId, circleId, title, description, proposalType, options = {}) {
    const members = this.readJson(this.membersFile)
    const member = members.find(m => m.userId === userId && m.circleId === circleId)
    
    if (!member || !['creator', 'admin', 'moderator'].includes(member.role)) {
      return { success: false, message: '权限不足' }
    }
    
    const proposal = {
      id: genId('proposal'),
      circleId,
      creatorId: userId,
      title,
      description,
      type: proposalType, // join_policy, content_policy, member_management, resource_allocation
      options,
      status: 'voting', // voting, passed, rejected, executed
      votes: { yes: 0, no: 0, abstain: 0 },
      createdAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后结束
    }
    
    const proposals = this.readJson(this.proposalsFile)
    proposals.push(proposal)
    this.writeJson(this.proposalsFile, proposals)
    
    return { success: true, proposal }
  }
  
  // 更新圈子统计
  updateCircleStats(circleId, memberDelta, postDelta) {
    const circles = this.readJson(this.circlesFile)
    const circle = circles.find(c => c.id === circleId)
    if (circle) {
      circle.memberCount = Math.max(0, (circle.memberCount || 0) + memberDelta)
      circle.postCount = Math.max(0, (circle.postCount || 0) + postDelta)
      this.writeJson(this.circlesFile, circles)
    }
  }
}

// 话题圈功能
class TopicCircle {
  constructor(dataDir) {
    this.dataDir = dataDir
    this.topicsFile = path.join(dataDir, 'topics.json')
    this.topicPostsFile = path.join(dataDir, 'topic_posts.json')
    this.topicUsersFile = path.join(dataDir, 'topic_users.json')
    
    this.initFiles()
  }
  
  initFiles() {
    [this.topicsFile, this.topicPostsFile, this.topicUsersFile].forEach(file => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([]))
      }
    })
  }
  
  readJson(file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8') || '[]')
    } catch {
      return []
    }
  }
  
  writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  }
  
  // 创建话题
  createTopic(creatorId, title, description, category, tags = [], duration = 7) {
    const topic = {
      id: genId('topic'),
      creatorId,
      title,
      description,
      category,
      tags,
      createdAt: new Date().toISOString(),
      endAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', // active, ended, archived
      participantCount: 1,
      postCount: 0,
      heat: 0 // 热度指数
    }
    
    const topics = this.readJson(this.topicsFile)
    topics.push(topic)
    this.writeJson(this.topicsFile, topics)
    
    // 创建者自动参与
    this.joinTopic(creatorId, topic.id)
    
    return topic
  }
  
  // 参与话题
  joinTopic(userId, topicId) {
    const topicUsers = this.readJson(this.topicUsersFile)
    const existing = topicUsers.find(tu => tu.userId === userId && tu.topicId === topicId)
    
    if (existing) {
      return { success: false, message: '已参与该话题' }
    }
    
    const topicUser = {
      id: genId('topic_user'),
      userId,
      topicId,
      joinedAt: new Date().toISOString(),
      postCount: 0
    }
    
    topicUsers.push(topicUser)
    this.writeJson(this.topicUsersFile, topicUsers)
    
    // 更新话题统计
    this.updateTopicStats(topicId, 1, 0)
    
    return { success: true, topicUser }
  }
  
  // 发布话题内容
  createTopicPost(userId, topicId, content, images = []) {
    const topicUsers = this.readJson(this.topicUsersFile)
    const participation = topicUsers.find(tu => tu.userId === userId && tu.topicId === topicId)
    
    if (!participation) {
      return { success: false, message: '请先参与该话题' }
    }
    
    const post = {
      id: genId('topic_post'),
      topicId,
      userId,
      content,
      images,
      createdAt: new Date().toISOString(),
      likes: 0,
      isExpert: false,
      isOfficial: false
    }
    
    const posts = this.readJson(this.topicPostsFile)
    posts.unshift(post)
    this.writeJson(this.topicPostsFile, posts)
    
    // 更新用户参与统计
    participation.postCount += 1
    this.writeJson(this.topicUsersFile, topicUsers)
    
    // 更新话题统计
    this.updateTopicStats(topicId, 0, 1)
    
    return { success: true, post }
  }
  
  // 获取热门话题
  getHotTopics(category = null, limit = 10) {
    const topics = this.readJson(this.topicsFile)
    let filtered = topics.filter(t => t.status === 'active')
    
    if (category) {
      filtered = filtered.filter(t => t.category === category)
    }
    
    // 按热度排序
    filtered.sort((a, b) => b.heat - a.heat)
    
    return filtered.slice(0, limit)
  }
  
  // 更新话题统计
  updateTopicStats(topicId, participantDelta, postDelta) {
    const topics = this.readJson(this.topicsFile)
    const topic = topics.find(t => t.id === topicId)
    if (topic) {
      topic.participantCount = Math.max(0, (topic.participantCount || 0) + participantDelta)
      topic.postCount = Math.max(0, (topic.postCount || 0) + postDelta)
      
      // 计算热度（简化算法）
      topic.heat = topic.participantCount * 2 + topic.postCount * 3
      
      this.writeJson(this.topicsFile, topics)
    }
  }
}

module.exports = {
  FriendCircle,
  InterestCircle,
  TopicCircle
}