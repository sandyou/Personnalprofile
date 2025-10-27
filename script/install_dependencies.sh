#!/bin/bash
APP_DIR="/home/ec2-user/app"

# 1. 停止 Nginx (在配置更新前)
systemctl stop nginx

# 2. 設定 Nginx 虛擬主機配置
echo "Copying Nginx configuration file..."
cp $APP_DIR/config/default.conf /etc/nginx/conf.d/default.conf

# 3. 前端相依套件安裝與編譯
echo "Installing and building React frontend..."
cd $APP_DIR/frontend/
npm install
npm run build # 假設您的編譯指令是 npm run build

# 4. 建立 Nginx 靜態檔案目標目錄並複製 React 檔案
echo "Setting up Nginx static files directory..."
mkdir -p /var/www/html/build 
cp -r build/* /var/www/html/build/ 

# 5. 後端相依套件安裝 (在後端目錄執行)
echo "Installing backend dependencies..."
cd $APP_DIR/backend/
npm install

#安裝20版本的node.js
echo "--- 0. Installing/Upgrading Node.js to v20 ---"

# 適用於 Amazon Linux / CentOS / RHEL (假設您的 EC2 是其中之一):
sudo yum update -y
sudo yum install -y curl

# 1. 移除舊版本
sudo yum remove -y nodejs npm

# 2. 獲取 Node.js 20 LTS 儲存庫並安裝
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 3. 檢查新版本 (用於日誌確認)
echo "Node.js version after upgrade:"
node -v

echo "--- Finished Node.js setup ---"
