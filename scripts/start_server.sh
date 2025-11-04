#!/bin/bash
echo "--- Running start_server.sh ---"
APP_DIR="/home/ec2-user/app"

# 1. 啟動 Nginx (以 root 執行)
echo "Starting Nginx service..."
sudo systemctl start nginx

# 2. 啟動 Node.js 後端 (切換到 ec2-user 身份來執行 PM2)
echo "Starting backend service as ec2-user..."
sudo su - ec2-user <<'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/ec2-user/app/backend
pm2 stop node-backend || true
pm2 delete node-backend || true
pm2 start server.js --name "node-backend"
pm2 save
EOF