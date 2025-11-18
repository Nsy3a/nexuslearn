#!/usr/bin/env python3
"""
Web3.0 AI学习平台 - 简化一键启动器
极简版本，快速启动交互界面
"""

import subprocess
import webbrowser
import time
import os
import sys
from pathlib import Path

def main():
    """主函数 - 一键启动"""
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║    🚀 Web3.0 AI学习平台 - 一键启动器 🚀                   ║
    ║                                                              ║
    ║    正在启动交互界面...                                      ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    # 获取项目路径
    project_root = Path(__file__).parent
    frontend_path = project_root / "nexuslearn-frontend"
    
    if not frontend_path.exists():
        print("❌ 项目目录不存在，请检查路径")
        return
    
    # 进入项目目录
    os.chdir(frontend_path)
    
    print("📦 检查依赖...")
    # 检查node_modules是否存在
    if not (frontend_path / "node_modules").exists():
        print("📥 安装依赖中...")
        subprocess.run(["npm", "install"], check=True)
    
    print("🚀 启动开发服务器...")
    # 启动开发服务器
    server_process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # 等待服务器启动
    print("⏳ 等待服务器启动...")
    time.sleep(5)
    
    # 检查服务器状态
    if server_process.poll() is None:
        print("✅ 服务器启动成功！")
        
        # 打开浏览器
        print("🌐 打开浏览器访问应用...")
        urls = [
            "http://localhost:5173",
            "http://192.168.1.92:5173",
            "http://127.0.0.1:5173"
        ]
        
        for url in urls:
            try:
                webbrowser.open(url)
                print(f"✅ 已打开: {url}")
                break
            except:
                continue
        
        print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║    🎉 Web3.0 AI学习平台已启动！ 🎉                       ║
    ║                                                              ║
    ║    🌐 访问地址:                                              ║
    ║       • http://localhost:5173/                              ║
    ║       • http://192.168.1.92:5173/                         ║
    ║                                                              ║
    ║    🎯 功能测试:                                              ║
    ║       1. 💰 连接Web3钱包                                     ║
    ║       2. 📚 体验知识仓库                                     ║
    ║       3. 🤝 参与AI社区                                       ║
    ║       4. 🧠 测试学习管理                                     ║
    ║                                                              ║
    ║    💡 按 Ctrl+C 停止服务器                                 ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
        """)
        
        try:
            # 等待用户中断
            server_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 正在停止服务器...")
            server_process.terminate()
            server_process.wait()
            print("✅ 服务器已停止")
    
    else:
        stdout, stderr = server_process.communicate()
        print(f"❌ 服务器启动失败: {stderr}")

if __name__ == "__main__":
    main()