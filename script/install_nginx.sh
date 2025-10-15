#!/bin/bash
echo "Installing Nginx, Node.js, and PM2..."

# 檢查並安裝 Nginx
if ! command -v nginx &> /dev/null
then
    echo "Nginx not found. Installing..."
    yum update -y # 適用於 Amazon Linux
    yum install nginx -y
    systemctl enable nginx # 設定開機啟動
fi

# 檢查並安裝 Node.js (使用 NVM 方式更靈活)
# 這裡使用簡單的 YUM 或 APT 安裝
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing..."
    # 這裡可以根據您的 AMI 選擇不同的安裝方式，例如 NodeSource 官方推薦的方式
    # 為了簡化，假設您使用 Amazon Linux 2023 或 Ubuntu 22
    # For Amazon Linux 2023:
    yum install nodejs -y 
fi

# 安裝 PM2 (Node.js 服務管理工具)
if ! command -v pm2 &> /dev/null
then
    echo "PM2 not found. Installing..."
    npm install -g pm2
fi
