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
