# NexusLearn MVP 部署指南

## 1. 环境要求
- Node.js ≥18
- Docker & Docker Compose
- Git

## 2. 本地启动
```bash
# 启动数据层
docker-compose up -d

# 安装后端依赖
cd nexuslearn/backend && npm install
npm run dev

# 安装前端依赖
cd nexuslearn-frontend && npm install
npm run dev

# 部署合约（本地）
cd contracts && npm install
npx hardhat node # 新终端
npx hardhat run scripts/deploy.js --network localhost
```

## 3. 测试网部署
1. 复制 `.env.example` 为 `.env`，填入 Sepolia 私钥与 RPC
2. 执行：
```bash
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/deploy_governance.js --network sepolia
```
3. 记录输出的合约地址，更新前端与后端 `.env`

## 4. 访问
- 前端：http://localhost:3000
- 后端 API：http://localhost:8080
- 合约监听：node contracts/scripts/listen.js

## 5. 核心功能验证
- 创建学习目标与计划
- 上传/搜索资料（融合排序）
- 发布需求→提交答案→验收→NFT 铸造
- 链上托管：创建需求后自动 Escrow 托管 USDC（approve+fund）
- 验收后按贡献比例铸造 NEXL 奖励（基准 1000 NEXL）
- 链上事件实时同步

## 6. 监控与日志
- Docker logs -f <service>
- 前端：Chrome DevTools
- 后端：控制台输出
- 合约：事件监听日志
