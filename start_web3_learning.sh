#!/bin/bash
# Web3.0 AI学习平台 - macOS/Linux一键启动器

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║    🚀 Web3.0 AI学习平台 - Unix一键启动器 🚀             ║"
echo "║                                                              ║"
echo "║    正在启动交互界面...                                      ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/nexuslearn-frontend"

echo "📦 检查项目依赖..."
cd "$PROJECT_DIR" || exit 1

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "📥 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查npm配置"
        exit 1
    fi
fi

echo "🚀 启动开发服务器..."
npm run dev &
SERVER_PID=$!

echo "⏳ 等待服务器启动..."
sleep 5

# 检查服务器是否成功启动
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ 服务器启动成功！"
    
    echo "🌐 打开浏览器访问应用..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "http://localhost:5173"
        open "http://192.168.1.92:5173"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "http://localhost:5173" 2>/dev/null || gnome-open "http://localhost:5173" 2>/dev/null
        xdg-open "http://192.168.1.92:5173" 2>/dev/null || gnome-open "http://192.168.1.92:5173" 2>/dev/null
    fi
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║    🎉 Web3.0 AI学习平台已启动！ 🎉                     ║"
    echo "║                                                              ║"
    echo "║    🌐 访问地址:                                              ║"
    echo "║       • http://localhost:5173/                              ║"
    echo "║       • http://192.168.1.92:5173/                         ║"
    echo "║                                                              ║"
    echo "║    🎯 功能测试:                                              ║"
    echo "║       1. 💰 连接Web3钱包                                     ║"
    echo "║       2. 📚 体验知识仓库                                     ║"
    echo "║       3. 🤝 参与AI社区                                       ║"
    echo "║       4. 🧠 测试学习管理                                     ║"
    echo "║                                                              ║"
    echo "║    💡 按 Ctrl+C 停止服务器                                 ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    # 等待用户中断
    trap 'echo "🛑 正在停止服务器..."; kill $SERVER_PID; exit 0' INT
    wait $SERVER_PID
else
    echo "❌ 服务器启动失败"
    exit 1
fi