#!/bin/bash

# Flipflop Pathfinders 前端开发环境启动脚本

echo "🚀 启动 Flipflop Pathfinders 前端开发环境..."

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js 版本: $node_version"
else
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查npm版本
npm_version=$(npm -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm 版本: $npm_version"
else
    echo "❌ 未找到 npm，请先安装 npm"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

# 检查后端服务
echo "🔍 检查后端服务..."
if curl -s http://localhost:8101/api/user/get/login > /dev/null 2>&1; then
    echo "✅ 后端服务运行正常 (http://localhost:8101)"
else
    echo "⚠️  后端服务未运行或无法访问 (http://localhost:8101)"
    echo "   请确保后端服务已启动"
fi

# 启动开发服务器
echo "🌟 启动前端开发服务器..."
echo "   前端地址: http://localhost:3000"
echo "   后端地址: http://localhost:8101/api"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
