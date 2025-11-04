#!/bin/bash
echo "--- Running build_and_copy.sh as $(whoami) ---"
APP_DIR="/home/ec2-user/app"

# 2. 複製 Nginx 設定
echo "Copying Nginx configuration..."
# (請確保您的 config/default.conf 存在於您推送的專案中)
sudo cp $APP_DIR/config/default.conf /etc/nginx/conf.d/default.conf

# 3. 複製 React 建置檔案
echo "Copying frontend build files to Nginx root..."
# (重要：請確認您的 React 輸出是 'build' 還是 'dist')
# 假設是 'build'
sudo rm -rf /var/www/html/* # 清空舊檔案
sudo cp -r $APP_DIR/frontend/dist/* /usr/share/nginx/html/

echo "--- Finished copying files ---" 