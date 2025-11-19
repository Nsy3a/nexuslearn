#!/usr/bin/env python3
"""
Web3.0 AI学习平台 - 一键启动器
一键启动前端交互界面和开发服务器
"""

import subprocess
import webbrowser
import time
import os
import sys
import platform
from pathlib import Path
import threading
import http.server
import socketserver

class Web3LearningPlatformLauncher:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.frontend_path = self.project_root / "nexuslearn-frontend"
        self.server_process = None
        self.is_server_running = False
        
    def print_banner(self):
        """打印启动横幅"""
        banner = """
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║    🌟 Web3.0 AI学习平台 - NexusLearn 🌟                                    ║
    ║                                                                              ║
    ║    ✨ 一键启动交互界面启动器 ✨                                           ║
    ║                                                                              ║
    ║    🚀 功能特性:                                                              ║
    ║       • AI驱动的个性化学习路径                                             ║
    ║       • Web3.0钱包集成与NFT证书                                           ║
    ║       • 智能社区系统（三圈架构）                                           ║
    ║       • 知识仓库与高级搜索引擎                                             ║
    ║       • 现代化UI设计与玻璃拟态效果                                        ║
    ║                                                                              ║
    ║    🎨 设计亮点:                                                              ║
    ║       • 动态粒子背景系统                                                   ║
    ║       • 渐变色彩与毛玻璃效果                                               ║
    ║       • 响应式布局与流畅动画                                               ║
    ║       • 多设计语言融合的独特美学                                             ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
        """
        print(banner)
        
    def check_environment(self):
        """检查运行环境"""
        print("🔍 检查运行环境...")
        
        # 检查Node.js
        try:
            result = subprocess.run(['node', '--version'], capture_output=True, text=True, shell=True)
            node_version = result.stdout.strip()
            if node_version:
                print(f"✅ Node.js: {node_version}")
            else:
                # 尝试使用PowerShell命令
                result = subprocess.run(['powershell', '-Command', 'node --version'], capture_output=True, text=True)
                node_version = result.stdout.strip()
                if node_version:
                    print(f"✅ Node.js: {node_version}")
                else:
                    print("❌ Node.js 未安装，请先安装Node.js >= 16.0.0")
                    return False
        except FileNotFoundError:
            print("❌ Node.js 未安装，请先安装Node.js >= 16.0.0")
            return False
            
        # 检查npm
        try:
            result = subprocess.run(['npm', '--version'], capture_output=True, text=True, shell=True)
            npm_version = result.stdout.strip()
            if npm_version:
                print(f"✅ npm: {npm_version}")
            else:
                # 尝试使用PowerShell命令
                result = subprocess.run(['powershell', '-Command', 'npm --version'], capture_output=True, text=True)
                npm_version = result.stdout.strip()
                if npm_version:
                    print(f"✅ npm: {npm_version}")
                else:
                    print("❌ npm 未安装，请先安装npm")
                    return False
        except FileNotFoundError:
            print("❌ npm 未安装，请先安装npm")
            return False
            
        # 检查项目目录
        if not self.frontend_path.exists():
            print(f"❌ 项目目录不存在: {self.frontend_path}")
            return False
            
        print("✅ 环境检查通过！")
        return True
        
    def install_dependencies(self):
        """安装项目依赖"""
        # 检查node_modules是否已存在
        node_modules_path = self.frontend_path / "node_modules"
        if node_modules_path.exists():
            print("✅ 项目依赖已安装，跳过安装步骤")
            return True
            
        print("📦 安装项目依赖...")
        try:
            # 使用绝对路径和shell=True以提高Windows兼容性
            result = subprocess.run(
                ['npm', 'install'], 
                cwd=self.frontend_path,
                capture_output=True, 
                text=True, 
                shell=True
            )
            if result.returncode == 0:
                print("✅ 依赖安装成功！")
                return True
            else:
                print(f"❌ 依赖安装失败: {result.stderr}")
                return False
        except Exception as e:
            print(f"❌ 安装依赖时出错: {e}")
            return False
            
    def start_frontend_server(self):
        """启动前端开发服务器"""
        print("🚀 启动前端开发服务器...")
        try:
            # 使用绝对路径和shell=True以提高Windows兼容性
            self.server_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.frontend_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True
            )
            
            # 等待服务器启动
            print("⏳ 等待服务器启动...")
            time.sleep(5)
            
            # 检查服务器状态
            if self.server_process.poll() is None:
                print("✅ 前端服务器启动成功！")
                self.is_server_running = True
                return True
            else:
                stdout, stderr = self.server_process.communicate()
                print(f"❌ 服务器启动失败: {stderr}")
                return False
                
        except Exception as e:
            print(f"❌ 启动服务器时出错: {e}")
            return False
            
    def open_browser(self):
        """打开浏览器访问应用"""
        print("🌐 打开浏览器访问应用...")
        urls = [
            "http://localhost:5173",
            "http://192.168.1.92:5173",
            "http://172.31.160.1:5173"
        ]
        
        for url in urls:
            try:
                webbrowser.open(url)
                print(f"✅ 已打开: {url}")
                break
            except Exception as e:
                print(f"⚠️  无法打开 {url}: {e}")
                continue
                
    def create_desktop_shortcut(self):
        """创建桌面快捷方式"""
        print("🎯 创建桌面快捷方式...")
        
        if platform.system() == "Windows":
            desktop_path = Path.home() / "Desktop"
            shortcut_path = desktop_path / "Web3 AI学习平台.lnk"
            
            # 创建批处理文件
            batch_content = f"""@echo off
cd /d "{self.frontend_path}"
start npm run dev
start http://localhost:5173
echo Web3 AI学习平台已启动！
echo 访问地址: http://localhost:5173
pause
"""
            
            batch_file = self.project_root / "start_platform.bat"
            with open(batch_file, 'w', encoding='utf-8') as f:
                f.write(batch_content)
                
            print(f"✅ 已创建批处理文件: {batch_file}")
            print("💡 您可以双击 start_platform.bat 快速启动平台")
            
        elif platform.system() == "Darwin":  # macOS
            desktop_path = Path.home() / "Desktop"
            script_path = desktop_path / "start_web3_learning.sh"
            
            script_content = f"""#!/bin/bash
cd "{self.frontend_path}"
npm run dev &
sleep 3
open http://localhost:5173
echo "Web3 AI学习平台已启动！"
echo "访问地址: http://localhost:5173"
"""
            
            with open(script_path, 'w') as f:
                f.write(script_content)
            
            # 添加执行权限
            os.chmod(script_path, 0o755)
            print(f"✅ 已创建启动脚本: {script_path}")
            
        elif platform.system() == "Linux":
            desktop_path = Path.home() / "Desktop"
            script_path = desktop_path / "start_web3_learning.sh"
            
            script_content = f"""#!/bin/bash
cd "{self.frontend_path}"
npm run dev &
sleep 3
xdg-open http://localhost:5173
echo "Web3 AI学习平台已启动！"
echo "访问地址: http://localhost:5173"
"""
            
            with open(script_path, 'w') as f:
                f.write(script_content)
            
            # 添加执行权限
            os.chmod(script_path, 0o755)
            print(f"✅ 已创建启动脚本: {script_path}")
            
    def display_access_info(self):
        """显示访问信息"""
        print("""
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║    🎉 Web3.0 AI学习平台已成功启动！ 🎉                                   ║
    ║                                                                              ║
    ║    🌐 访问地址:                                                              ║
    ║       • 本地访问: http://localhost:5173/                                   ║
    ║       • 网络访问: http://192.168.1.92:5173/                                ║
    ║       • 局域网访问: http://172.31.160.1:5173/                              ║
    ║                                                                              ║
    ║    🚀 功能测试指南:                                                          ║
    ║       1. 💰 Web3.0钱包连接测试                                               ║
    ║       2. 📚 知识仓库系统体验                                                 ║
    ║       3. 🤝 AI社区系统互动                                                   ║
    ║       4. 🧠 学习管理中心测试                                                 ║
    ║       5. 🔍 高级搜索功能体验                                                 ║
    ║                                                                              ║
    ║    🎨 设计特色体验:                                                          ║
    ║       • 动态粒子背景系统                                                     ║
    ║       • 玻璃拟态视觉效果                                                     ║
    ║       • 渐变色彩与流畅动画                                                   ║
    ║       • 响应式布局与交互体验                                                 ║
    ║                                                                              ║
    ║    💡 提示: 按 Ctrl+C 停止服务器                                             ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
        """)
        
    def monitor_server(self):
        """监控服务器状态"""
        try:
            while self.is_server_running:
                if self.server_process and self.server_process.poll() is not None:
                    print("\n⚠️  服务器已停止运行")
                    self.is_server_running = False
                    break
                time.sleep(2)
        except KeyboardInterrupt:
            print("\n🛑 正在停止服务器...")
            self.stop_server()
            
    def stop_server(self):
        """停止服务器"""
        if self.server_process:
            self.server_process.terminate()
            self.server_process.wait()
            print("✅ 服务器已停止")
            self.is_server_running = False
            
    def run(self):
        """主运行函数"""
        try:
            self.print_banner()
            
            # 检查环境
            if not self.check_environment():
                return
                
            # 安装依赖
            if not self.install_dependencies():
                return
                
            # 启动前端服务器
            if not self.start_frontend_server():
                return
                
            # 打开浏览器
            self.open_browser()
            
            # 创建桌面快捷方式
            self.create_desktop_shortcut()
            
            # 显示访问信息
            self.display_access_info()
            
            # 监控服务器状态
            self.monitor_server()
            
        except KeyboardInterrupt:
            print("\n🛑 用户中断，正在清理...")
            self.stop_server()
        except Exception as e:
            print(f"❌ 运行出错: {e}")
            self.stop_server()
        finally:
            print("👋 感谢使用 Web3.0 AI学习平台！")

if __name__ == "__main__":
    launcher = Web3LearningPlatformLauncher()
    launcher.run()