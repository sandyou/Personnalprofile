// src/App.jsx

import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import InfoBox from './components/InfoBox';
// (不需要 ContactForm.jsx)

const App = () => {
  const [info, setInfo] = useState('');

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 【修改 1】將 info 和 setInfo 都傳入 Canvas */}
      <GameCanvas info={info} setInfo={setInfo} />
      
      {/* 【修改 2】傳入 onClose 函式，讓 InfoBox 內部的表單可以關閉自己 */}
      <InfoBox info={info} onClose={() => setInfo('')} />
    </div>
  );
};

export default App;