#!/bin/bash
set -e
echo "🚀 NexusLearn MVP 一键演示"
echo "1️⃣ 启动数据层（PostgreSQL/ES/Milvus/Neo4j/IPFS）..."
docker-compose up -d
echo "2️⃣ 启动后端..."
cd nexuslearn/backend && npm run dev &
BACK_PID=$!
echo "3️⃣ 启动前端..."
cd ../nexuslearn-frontend && npm run dev &
FRONT_PID=$!
echo "4️⃣ 启动链节点与事件监听..."
cd ../../contracts
npx hardhat node &
HARDHAT_PID=$!
sleep 5
npx hardhat run scripts/deploy.js --network localhost
node scripts/listen.js &
LISTEN_PID=$!
echo "✅ 全部服务已启动"
echo "📖 请打开 http://localhost:3000 并按 test/manual-e2e.md 操作"
echo "按 Ctrl+C 结束所有进程"
trap "kill $BACK_PID $FRONT_PID $HARDHAT_PID $LISTEN_PID; docker-compose down" EXIT
wait