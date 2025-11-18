@echo off
echo 🚀 NexusLearn MVP 一键演示
echo 1️⃣ 启动数据层（PostgreSQL/ES/Milvus/Neo4j/IPFS）...
docker-compose up -d
echo 2️⃣ 启动后端...
cd nexuslearn\backend && start npm run dev
echo 3️⃣ 启动前端...
cd ..\nexuslearn-frontend && start npm run dev
echo 4️⃣ 启动链节点与事件监听...
cd ..\..\contracts && start npx hardhat node && timeout /t 5 && npx hardhat run scripts/deploy.js --network localhost && start node scripts/listen.js
timeout /t 2
npx hardhat run scripts/deploy_governance.js --network localhost
echo ✅ 全部服务已启动
echo 📖 请打开 http://localhost:3000 并按 test\manual-e2e.md 操作
echo 按任意键结束所有进程（手动关闭窗口）
pause
