#!/bin/bash
echo "--- Running fix_permissions.sh ---"
# 將 CodeDeploy 複製過來的檔案擁有者從 root 改為 ec2-user
# 這樣 ec2-user 才能執行 npm install
chown -R ec2-user:ec2-user /home/ec2-user/app