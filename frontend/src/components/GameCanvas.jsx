import React, { useEffect, useRef, useState } from 'react';

// 接收 info 和 setInfo
const GameCanvas = ({ info, setInfo }) => {
  const canvasRef = useRef(null);
  const playerRef = useRef({
    x: 100,
    y: 0,
    width: 40, 
    height: 60,
    velocityX: 0,
    velocityY: 0,
    isJumping: false, 
    jumpCount: 0,   
    isGrounded: false, 
  });
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); 
  
  const keysRef = useRef({
    ArrowLeft: false,
    ArrowRight: false,
    " ": false, 
  });

  const cloudsRef = useRef([]);
  const grassRef = useRef([]);

  // (物理引擎參數... 保持不變)
  const gravity = 0.8;
  const jumpForce = -12; 
  const moveSpeed = 5;
  const groundY = useRef(0);
  const fixedTimeStep = 1000 / 60;
  const lastTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  // (地圖區塊... 保持不變)
  const mapBlocks = [
    { xOffset: -320, yOffset: 120, width: 80, height: 30, color: '#E5A04A', info: '關於我：我是一位專案經理和雲端工程師，熱愛技術和種花。' },
    { xOffset: -180, yOffset: 120, width: 80, height: 30, color: '#E5A04A', info: '技能：AWS, Python, React' },
    { xOffset: -40,  yOffset: 120, width: 80, height: 30, color: '#E5A04A', info: '作品集：AWS CI/CD Pipeline 和數據分析儀表板。' },
    { xOffset: 100,  yOffset: 220, width: 80, height: 30, color: '#E5A04A', info: '證照：AWS DOP, PMP' },
    { xOffset: 240,  yOffset: 220, width: 80, height: 30, color: '#E5A04A', info: 'CONTACT_FORM' },
  ];

  // (resizeCanvas... 【修改】)
  const resizeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const player = playerRef.current;
      const oldGroundY = groundY.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (canvas.height > 0) {
        groundY.current = canvas.height - 50; 
      }
      setCanvasSize({ width: canvas.width, height: canvas.height });

      // 【修改 1】生成雲朵的資料 (移除 'r'，加入 'scale')
      if (cloudsRef.current.length === 0) {
        for (let i = 0; i < 5; i++) {
          cloudsRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (groundY.current * 0.3) + 50, // Y 座標
            scale: 0.8 + Math.random() * 0.5 // 縮放 0.8x 到 1.3x
          });
        }
      }
      
      // (草地生成... 保持不變)
      if (grassRef.current.length === 0) {
        const grassCount = canvas.width / 20; 
        for (let i = 0; i < grassCount; i++) {
          grassRef.current.push({
            x: (i * 20) + (Math.random() * 15 - 10), 
            scale: 0.7 + Math.random() * 0.6, 
            style: Math.random() < 0.7 ? 1 : 2 
          });
        }
        grassRef.current.sort((a, b) => a.scale - b.scale);
      }
      
      if (groundY.current > 0 && (player.y === 0 || (player.y + player.height) >= oldGroundY)) {
        player.y = groundY.current - player.height;
      }
    }
  };

  // (drawPlayer... 保持不變)
  const drawPlayer = (ctx, x, y, width, height) => {
    const unit = width / 10;
    // ( ... 原始繪製程式碼 ... )
    // 頭髮（灰色）
    ctx.fillStyle = '#443400ff';
    ctx.fillRect(x + 3 * unit, y, 4 * unit, 2 * unit);
    ctx.fillRect(x + 2 * unit, y + 2 * unit, 6 * unit, 2 * unit);
    ctx.fillRect(x + 1 * unit, y + 4 * unit, 8 * unit, 2 * unit);
    // 臉部（皮膚色）
    ctx.fillStyle = '#FFD7B5';
    ctx.fillRect(x + 3 * unit, y + 6 * unit, 4 * unit, 3 * unit);
    // 眼睛（黑色）
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 3.5 * unit, y + 7 * unit, 1 * unit, 1 * unit);
    ctx.fillRect(x + 5.5 * unit, y + 7 * unit, 1 * unit, 1 * unit);
    // 嘴巴（紅色）
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x + 4 * unit, y + 8.5 * unit, 2 * unit, 0.5 * unit);
    // 上衣（白色）
    ctx.fillStyle = '#c7c05fff';
    ctx.fillRect(x + 1 * unit, y + 9 * unit, 8 * unit, 5 * unit);
    // 領帶（藍色）
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(x + 3.5 * unit, y + 11 * unit, 3 * unit, 1 * unit);
    // 褲子（紅色）
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(x + 2 * unit, y + 14 * unit, 6 * unit, 4 * unit);
    // 鞋子（紅色）
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + 2.5 * unit, y + 18 * unit, 2 * unit, 1 * unit);
    ctx.fillRect(x + 5.5 * unit, y + 18 * unit, 2 * unit, 1 * unit);
    // 手（皮膚色）
    ctx.fillStyle = '#FFD7B5';
    ctx.fillRect(x, y + 10 * unit, 1 * unit, 3 * unit);
    ctx.fillRect(x + 9 * unit, y + 10 * unit, 1 * unit, 3 * unit);
  };

  // 【修改 2】重寫 drawClouds 函式
  const drawClouds = (ctx) => {
    const cloudWhite = '#FFFFFF';
    const cloudShadow = '#E0E0E0'; // 淺灰色陰影

    cloudsRef.current.forEach(cloud => {
      const p = 4 * cloud.scale; // 基礎像素 (4px) 乘上縮放
      const startX = cloud.x;
      const startY = cloud.y;

      // 繪製 8x5 的像素雲朵
      
      // --- 頂部 (白色) ---
      ctx.fillStyle = cloudWhite;
      ctx.fillRect(startX + p*2, startY + p*0, p*4, p*1); // (2,0) 4x1
      ctx.fillRect(startX + p*1, startY + p*1, p*6, p*1); // (1,1) 6x1
      ctx.fillRect(startX + p*0, startY + p*2, p*8, p*1); // (0,2) 8x1
      
      // --- 底部 (陰影) ---
      ctx.fillStyle = cloudShadow;
      ctx.fillRect(startX + p*0, startY + p*3, p*8, p*1); // (0,3) 8x1
      ctx.fillRect(startX + p*1, startY + p*4, p*6, p*1); // (1,4) 6x1
    });
  };
  
  // (drawGrass... 保持不變)
  const drawGrass = (ctx, groundYValue) => {
    const palette1 = {
      base: '#1D7A46', 
      mid: '#27AE60',   
      highlight: '#6DD47E' 
    };
    const palette2 = { 
      base: '#1A6A3D',
      mid: '#229954',
      highlight: '#58C46D'
    };

    grassRef.current.forEach(grass => {
      const p = 4 * grass.scale; 
      const palette = grass.style === 1 ? palette1 : palette2;
      const yDepthOffset = (1 - grass.scale) * 15;
      const startX = grass.x;
      const startY = groundYValue - (p * 8) + yDepthOffset;

      // 底部
      ctx.fillStyle = palette.base;
      ctx.fillRect(startX + p*1, startY + p*7, p*6, p*1); 
      ctx.fillRect(startX + p*2, startY + p*6, p*4, p*1); 
      
      // 中間
      ctx.fillStyle = palette.mid;
      ctx.fillRect(startX + p*1, startY + p*5, p*6, p*1); 
      ctx.fillRect(startX + p*2, startY + p*4, p*5, p*1); 
      ctx.fillRect(startX + p*1, startY + p*3, p*2, p*1); 
      ctx.fillRect(startX + p*4, startY + p*3, p*2, p*1); 
      
      // 高光
      ctx.fillStyle = palette.highlight;
      ctx.fillRect(startX + p*3, startY + p*2, p*2, p*1); 
      ctx.fillRect(startX + p*1, startY + p*4, p*1, p*1); 
      ctx.fillRect(startX + p*3, startY + p*5, p*2, p*1); 
      ctx.fillRect(startX + p*6, startY + p*5, p*1, p*1); 
    });
  };

  // (checkGroundCollision... 保持不變)
  const checkGroundCollision = (player) => {
    if (groundY.current === 0) return false;
    return player.y + player.height >= groundY.current;
  };

  // (updateGame... 保持不變)
  const updateGame = (deltaTime) => {
    // 1. 防呆
    if (!canvasRef.current || canvasRef.current.width === 0 || groundY.current === 0) {
      return;
    }
    // 2. 凍結
    if (info === 'CONTACT_FORM') {
      return;
    }
    // 3. 遊戲邏輯
    const player = playerRef.current;
    const timeRatio = deltaTime / fixedTimeStep;
    const canvasWidth = canvasRef.current.width;
    const groundYValue = groundY.current;
    const wasGrounded = player.isGrounded;
    // 水平移動
    player.velocityX = 0;
    if (keysRef.current.ArrowLeft) player.velocityX = -moveSpeed;
    if (keysRef.current.ArrowRight) player.velocityX = moveSpeed;
    player.x += player.velocityX * timeRatio;
    // 水平畫布邊界
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;
    // 垂直移動
    player.velocityY += gravity * timeRatio;
    player.y += player.velocityY * timeRatio;
    // 垂直畫布天花板邊界
     if (player.y < 0) {
      player.y = 0;
      player.velocityY = 0; 
    }
    let onPlatform = false; 
    let foundBlock = false; 
    // 地面碰撞
    if (checkGroundCollision(player)) {
      player.y = groundYValue - player.height;
      player.velocityY = 0;
      onPlatform = true; 
    }
    // AABB 碰撞解析
    const screenCenterX = canvasWidth / 2;
    const collisionPadding = 10; 
    const playerPhysicalLeft = player.x + collisionPadding;
    const playerPhysicalRight = player.x + player.width - collisionPadding;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;
    mapBlocks.forEach((block) => {
      const blockX = screenCenterX + block.xOffset;
      const blockY = groundYValue - block.yOffset - block.height;
      const blockLeft = blockX;
      const blockRight = blockX + block.width;
      const blockTop = blockY;
      const blockBottom = blockY + block.height;
      const horizontalOverlap = playerPhysicalRight > blockLeft && playerPhysicalLeft < blockRight;
      const verticalOverlap = playerBottom > blockTop && playerTop < blockBottom;
      if (horizontalOverlap && verticalOverlap) {
        foundBlock = true;
        const overlapXRight = playerPhysicalRight - blockLeft;
        const overlapXLeft = blockRight - playerPhysicalLeft;
        const overlapYBottom = playerBottom - blockTop;
        const overlapYTop = blockBottom - playerTop;
        const minOverlapX = Math.min(overlapXRight, overlapXLeft);
        const minOverlapY = Math.min(overlapYBottom, overlapYTop);
        if (minOverlapY < minOverlapX) {
          if (overlapYBottom < overlapYTop) {
            player.y = blockTop - player.height;
            player.velocityY = 0;
            onPlatform = true; 
            if (!wasGrounded) setInfo(block.info); 
          } else {
            player.y = blockBottom;
            player.velocityY = 0;
            if (!wasGrounded) setInfo(block.info); 
          }
        } else {
          if (overlapXRight < overlapXLeft) {
            player.x = blockLeft - player.width + collisionPadding;
          } else {
            player.x = blockRight - collisionPadding;
          }
          player.velocityX = 0;
        }
      }
    });
    // info 清除
    if (!foundBlock) {
      if (info !== 'CONTACT_FORM') {
        setInfo(''); 
      }
    }
    // 重設跳躍
    if (onPlatform) {
      player.isJumping = false;
      player.jumpCount = 0;
    } else {
      player.isJumping = true; 
    }
    // 更新 isGrounded
    player.isGrounded = onPlatform;
  };

  // (gameLoop... 保持不變)
  const gameLoop = (timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    accumulatedTimeRef.current += deltaTime;

    while (accumulatedTimeRef.current >= fixedTimeStep) {
      updateGame(fixedTimeStep);
      accumulatedTimeRef.current -= fixedTimeStep;
    }
    
    if (canvasRef.current && canvasRef.current.width > 0 && groundY.current > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const groundYValue = groundY.current;
      const screenCenterX = canvas.width / 2;
      // 1. 繪製天空
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 2. 繪製雲朵 (現在是 8-bit)
      drawClouds(ctx);
      // 3. 繪製地面
      ctx.fillStyle = '#27AE60';
      ctx.fillRect(0, groundYValue, canvas.width, 50);
      // 4. 繪製草地
      drawGrass(ctx, groundYValue);
      // 5. 繪製平台
      mapBlocks.forEach((block) => {
        const blockX = screenCenterX + block.xOffset;
        const blockY = groundYValue - block.yOffset - block.height;
        ctx.fillStyle = block.color;
        ctx.fillRect(blockX, blockY, block.width, block.height);
      });
      // 6. 繪製角色
      drawPlayer(ctx, playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height);
    }

    requestAnimationFrame(gameLoop);
  };

  // (useEffect (掛載時)... 保持不變)
  useEffect(() => {
    let animationFrameId = null;

    const handleKeyUp = (e) => {
      if (keysRef.current.hasOwnProperty(e.key)) {
        keysRef.current[e.key] = false;
      }
    };
    
    const handleResize = () => {
      resizeCanvas();
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize); 
    
    handleResize(); 
    
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); 

  // (useEffect (鍵盤鎖定)... 保持不變)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (info === 'CONTACT_FORM') {
         return;
      }
      if (keysRef.current.hasOwnProperty(e.key)) {
        keysRef.current[e.key] = true;
      }
      if (e.key === ' ' && playerRef.current.jumpCount < 2) {
        playerRef.current.velocityY = jumpForce; 
        playerRef.current.isJumping = true; 
        playerRef.current.jumpCount++; 
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [info]); 

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;