#!/bin/bash

# 部署生命週期: ValidateService
# 目的: 驗證服務是否成功啟動並正常運行。

# 這裡使用一個簡單的檢查：確認 Nginx 服務是否處於 active 狀態。
echo "--- Running validate_service.sh: Checking service health ---"

# 檢查 Nginx 狀態
if sudo systemctl is-active --quiet nginx; then
    echo "Nginx service is running (Active)."
else
    echo "ERROR: Nginx service is not running. Deployment FAILED."
    # 如果 Nginx 沒啟動，則返回非 0 退出碼，導致 CodeDeploy 失敗
    exit 1 
fi

# (可選) 檢查網站是否回應 200 OK
# 假設您的網站運行在 localhost:80
echo "Checking HTTP endpoint..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep 200; then
    echo "Website endpoint returned 200 OK."
else
    echo "ERROR: Website did not return 200 OK. Deployment FAILED."
    exit 1
fi

echo "--- Service validation SUCCEEDED ---"

# 成功退出，CodeDeploy 將標記部署成功
exit 0