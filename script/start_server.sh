#!/bin/bash
APP_DIR="/home/ec2-user/app"

# 1. 啟動或重啟 Node.js 後端服務 (使用 PM2)
echo "Starting/restarting backend service with PM2..."
cd $APP_DIR/backend/
# 確保每次部署都用新的程式碼重啟
pm2 stop all # 停止所有舊服務
pm2 delete all # 刪除所有舊配置
pm2 start server.js --name "node-backend" 
pm2 save # 儲存 PM2 狀態，以便重啟後自動恢復

# 2. 啟動 Nginx
echo "Starting Nginx..."
systemctl start nginx
