// src/components/InfoBox.jsx

import React, { useState, useEffect } from 'react';

// 【修改 1】 接收 info 和 onClose (即 setInfo(''))
const InfoBox = ({ info, onClose }) => {
  // 【修改 2】 新增表單所需的 state
  const [subject, setSubject] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');

  // 當 info 改變時 (例如從 'CONTACT_FORM' 變回 '關於我')，清空表單
  useEffect(() => {
    if (info !== 'CONTACT_FORM') {
      setSubject('');
      setContact('');
      setContent('');
    }
  }, [info]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 這裡您可以加入未來串接後端的 fetch 邏輯
    alert(`
      訊息已送出 (模擬):
      主旨: ${subject}
      聯絡方式: ${contact}
      內容: ${content}
    `);
    onClose(); // 送出後呼叫 onClose (即 setInfo('')) 來關閉
  };

  // 【修改 3】 定義一些內聯樣式 (inline styles)
  const baseStyle = {
    position: 'absolute',
    top: '20%', // 表單位置可以調高一點，或改 '50%' 和 transformY
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    display: info ? 'block' : 'none', // 根據 info 決定顯示或隱藏
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    color: '#333',
    zIndex: 100,
  };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
  const textareaStyle = { ...inputStyle, height: '100px', resize: 'vertical' };
  const buttonStyle = { padding: '10px 15px', marginRight: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px' };

  // 【修改 4】 條件渲染
  const renderContent = () => {
    // 如果 info 是 'CONTACT_FORM'，顯示表單
    if (info === 'CONTACT_FORM') {
      return (
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', textAlign: 'center' }}>
            聯絡我
          </h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '5px' }}>主旨</label>
            <input
              id="subject"
              type="text"
              style={inputStyle}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            
            <label htmlFor="contact" style={{ display: 'block', marginBottom: '5px' }}>聯絡方式 (Email/Phone)</label>
            <input
              id="contact"
              type="text"
              style={inputStyle}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />

            <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>內容</label>
            <textarea
              id="content"
              style={textareaStyle}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <div>
              <button type="submit" style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}>
                送出
              </button>
              <button type="button" style={{ ...buttonStyle, backgroundColor: '#f0f0f0', color: '#333' }} onClick={onClose}>
                取消
              </button>
            </div>
          </form>
        </div>
      );
    }

    // 否則，顯示原來的文字
    return info;
  };

  return (
    <div style={baseStyle}>
      {renderContent()}
    </div>
  );
};

export default InfoBox;