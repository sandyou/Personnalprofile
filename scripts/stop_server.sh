#!/bin/bash
# (appspec.yml 指定 runas: root)
echo "--- Running stop_server.sh: Stopping existing services ---"

# 1. 停止 Nginx 服務
if systemctl status nginx >/dev/null 2>&1; then
    echo "Stopping Nginx service..."
    systemctl stop nginx
    echo "Nginx stopped."
else
    echo "Nginx service is not active, skipping stop."
fi

# 2. 停止 Node.js 服務 (切換到 ec2-user)
echo "Stopping Node.js services managed by PM2 as ec2-user..."
sudo su - ec2-user <<'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 檢查 PM2 是否存在
if command -v pm2 >/dev/null 2>&1; then
    if pm2 list | grep -q "node-backend"; then
        pm2 stop node-backend
        pm2 delete node-backend
        echo "Node.js service 'node-backend' stopped and deleted."
    else
        echo "No 'node-backend' process found in PM2 list for ec2-user."
    fi
else
    echo "PM2 not found for ec2-user."
fi
EOF

echo "--- Finished stopping services ---"
exit 0