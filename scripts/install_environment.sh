#!/bin/bash
echo "--- Running install_environment.sh ---"

# 1. 安裝 Nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo yum update -y
    sudo yum install nginx -y
    sudo systemctl enable nginx
fi

# 2. 安裝 Node.js v20 (正確的方式)
echo "Installing Node.js v20..."
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

echo "Node.js version:"
node -v

# 3. 安裝 PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi