# NexusLearn MVP

AI 驱动的去中心化学习生态，支持个性化学习路径、知识资产 NFT、链上协作赏金。

## 功能亮点
- 学习管理：目标/计划/进度/自适应评估
- 知识仓库：多源摄取、IPFS 存储、融合搜索
- 需求协作：USDC 赏金、链上托管、NFT 铸造
- 链上治理：事件监听、贡献证明、社区所有权

## 技术栈
- 前端：Vue3 + TypeScript + Vite + Element Plus + PWA
- 后端：Node + Express + PostgreSQL + ElasticSearch + Milvus + Neo4j + IPFS
- 合约：Solidity + OpenZeppelin + Hardhat

## 快速开始
见 [DEPLOY.md](./DEPLOY.md)

## 测试
```bash
# 合约测试
cd contracts && npx hardhat test

# 前端单元测试
cd nexuslearn-frontend && npm run test

# E2E 测试
cd nexuslearn-frontend && npx playwright test
```

## 路线图
- Phase 1：MVP 完成 ✅
- Phase 2：主网部署、治理代币、社区 DAO
- Phase 3：AI 自我进化、跨链、移动端原生