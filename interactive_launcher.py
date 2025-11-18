#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Web3.0 AI学习平台 - 交互界面启动器
Interactive Interface Launcher for Web3.0 AI Learning Platform

提供一键启动交互界面的功能
Provides one-click interactive interface launch functionality
"""

import webbrowser
import sys
import os
import platform
import subprocess
import time
from pathlib import Path

def print_banner():
    """打印启动器横幅"""
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

def check_server_running():
    """检查服务器是否正在运行"""
    try:
        # 尝试访问本地服务器
        import urllib.request
        import urllib.error
        
        # 检查常见的端口
        ports = [5173, 5174, 3000, 8080]
        for port in ports:
            try:
                response = urllib.request.urlopen(f'http://localhost:{port}', timeout=1)
                if response.getcode() == 200:
                    return f"http://localhost:{port}"
            except:
                continue
        return None
    except:
        return None

def open_browser(url):
    """打开浏览器"""
    try:
        system = platform.system()
        
        if system == "Windows":
            # Windows系统 - 尝试多个浏览器
            browsers = [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
                'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
                'C:\\Program Files\\Microsoft Edge\\Application\\msedge.exe',
                'C:\\Program Files (x86)\\Microsoft Edge\\Application\\msedge.exe'
            ]
            
            browser_opened = False
            for browser_path in browsers:
                if os.path.exists(browser_path):
                    try:
                        subprocess.Popen([browser_path, url])
                        browser_opened = True
                        break
                    except:
                        continue
            
            if not browser_opened:
                webbrowser.open(url)
                
        elif system == "Darwin":  # macOS
            subprocess.Popen(['open', url])
        else:  # Linux
            subprocess.Popen(['xdg-open', url])
            
        return True
    except Exception as e:
        print(f"❌ 打开浏览器失败: {e}")
        return False

def start_server():
    """启动开发服务器"""
    print("🔄 正在启动开发服务器...")
    
    try:
        # 检查前端目录是否存在
        frontend_dir = Path("nexuslearn-frontend")
        if not frontend_dir.exists():
            print("❌ 前端目录不存在，请确保项目结构正确")
            return False
            
        # 启动开发服务器
        os.chdir(frontend_dir)
        
        # 使用start命令在后台启动（Windows）
        if platform.system() == "Windows":
            subprocess.Popen(['start', 'cmd', '/k', 'npm', 'run', 'dev'], shell=True)
        else:
            # Unix系统
            subprocess.Popen(['npm', 'run', 'dev'], 
                           stdout=subprocess.DEVNULL, 
                           stderr=subprocess.DEVNULL)
        
        print("✅ 开发服务器启动命令已发送")
        return True
        
    except Exception as e:
        print(f"❌ 启动服务器失败: {e}")
        return False

def main():
    """主函数"""
    print_banner()
    
    print("🔍 检查运行环境...")
    
    # 检查服务器是否已在运行
    print("🔍 检查是否已有服务器在运行...")
    running_url = check_server_running()
    
    if running_url:
        print(f"✅ 发现正在运行的服务器: {running_url}")
        print("🌐 正在打开交互界面...")
        
        if open_browser(running_url):
            print(f"🎉 交互界面已成功打开: {running_url}")
            print("\n📱 您也可以通过以下地址访问:")
            print(f"   • 本地地址: {running_url}")
            print(f"   • 网络地址: {running_url.replace('localhost', '您的IP地址')}")
        else:
            print(f"❌ 无法自动打开浏览器，请手动访问: {running_url}")
    else:
        print("⚠️  未检测到运行中的服务器")
        print("🔄 正在启动新的服务器...")
        
        if start_server():
            print("⏳ 等待服务器启动...")
            time.sleep(5)  # 等待服务器启动
            
            # 再次检查
            new_url = check_server_running()
            if new_url:
                print(f"✅ 服务器已启动: {new_url}")
                if open_browser(new_url):
                    print(f"🎉 交互界面已成功打开: {new_url}")
                else:
                    print(f"❌ 无法自动打开浏览器，请手动访问: {new_url}")
            else:
                print("❌ 服务器启动失败，请检查npm和项目依赖")
                print("💡 建议手动运行: cd nexuslearn-frontend && npm run dev")
        else:
            print("❌ 无法启动服务器")
    
    print("\n🎯 交互界面启动完成！")
    print("🚀 享受您的Web3.0 AI学习之旅！")
    
    # 保持程序运行，等待用户输入
    input("\n按Enter键退出启动器...")

if __name__ == "__main__":
    main()