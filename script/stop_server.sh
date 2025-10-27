#!/bin/bash

# 部署生命週期: BeforeInstall
# 目的: 在安裝新程式碼之前，安全地停止舊的服務，避免端口衝突。

echo "--- Running stop_server.sh: Stopping existing services ---"

# 1. 停止 Nginx 服務 (Web Server / 反向代理)
# 檢查 Nginx 是否正在運行，並嘗試停止它
if systemctl status nginx >/dev/null 2>&1; then
    echo "Stopping Nginx service..."
    sudo systemctl stop nginx
    echo "Nginx stopped."
else
    echo "Nginx service is not active, skipping stop."
fi

# 2. 停止 Node.js 服務 (使用 PM2)
# 檢查 PM2 是否已安裝且有任何名為 'node-backend' 的服務在運行
if command -v pm2 >/dev/null 2>&1; then
    echo "Stopping Node.js services managed by PM2..."
    
    # 檢查是否有特定的服務在運行 (假設您的後端服務名為 node-backend)
    if pm2 list | grep -q "node-backend"; then
        pm2 stop node-backend
        pm2 delete node-backend
        echo "Node.js service 'node-backend' stopped and deleted from PM2 list."
    else
        echo "No 'node-backend' process found in PM2 list."
    fi
else
    echo "PM2 not installed, skipping Node.js service stop."
fi

echo "--- Finished stopping services ---"

# 退出腳本，CodeDeploy 將繼續執行
exit 0