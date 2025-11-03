import React, { useState } from 'react';
import './App.css'; // 假設您有 App.css 用於樣式

// --- 介面元件 ---

const Header = ({ name, title }) => (
  <header className="App-header">
    <h1>{name}</h1>
    <p className="subtitle">{title}</p>
    <nav>
      <a href="#about">關於我</a> | 
      <a href="#portfolio">作品集</a> | 
      <a href="#contact">聯絡方式</a>
    </nav>
  </header>
);

const Section = ({ id, title, children }) => (
  <section id={id} className="section-container">
    <h2>{title}</h2>
    <div className="section-content">{children}</div>
  </section>
);

// --- 主要應用程式邏輯 ---

function PersonalWebsite() {
  const [contactMessage, setContactMessage] = useState('');
  
  // 模擬作品集資料
  const projects = [
    { id: 1, name: "AWS CI/CD Pipeline", description: "從 GitHub 自動部署 React + Node.js 應用程式到 EC2。", link: "https://your-public-ip-or-domain" },
    { id: 2, name: "數據分析儀表板", description: "使用 React 繪製即時數據圖表。", link: "#" },
    // 您可以在這裡新增更多作品
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // 這裡可以呼叫您的 Node.js 後端 API (Port 8080) 來發送郵件
    // fetch('/api/contact', { ... }) 
    
    setContactMessage('訊息已成功送出！感謝您的聯絡。');
    // 實際應用中，這裡應該執行 API 呼叫
    setTimeout(() => setContactMessage(''), 3000);
  };

  return (
    <div className="App">
      
      {/* 標頭區塊 */}
      <Header 
        name="Sandyhu" 
        title="專案經理 | 雲端工程師 " 
      />
      <main className="content-grid">
        {/* 關於我區塊 */}
        <Section id="about" title="關於我">
          <p>一位種花的工程師，希望能找到自己的一片小天地。</p>
          <p><strong> 技能：</strong> Python, AWS, Linux </p>
          <p><strong>學習中：</strong> React, Node.js </p>
          <p><strong>證照：</strong> <br></br>AWS Solution Architect Associate<br></br>AWS Devops Professional<br></br> Project Management Professional</p>
        </Section>

        {/* 作品集區塊 */}
        <Section id="portfolio" title="我的作品集">
          <div className="project-list">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer">查看專案 &rarr;</a>
              </div>
            ))}
          </div>
        </Section>
        

        {/* 聯絡方式區塊 */}
        <Section id="contact" title="聯絡方式">
          <p>如果您有任何合作機會或問題，請隨時與我聯繫！</p>
          
          {contactMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{contactMessage}</p>}
          
          <form onSubmit={handleContactSubmit} className="contact-form">
            <input type="text" placeholder="您的姓名" required />
            <input type="email" placeholder="您的電子郵件" required />
            <textarea placeholder="您的訊息" rows="5" required></textarea>
            <button type="submit">送出訊息</button>
          </form>
        </Section>
      </main>


      <footer>
        <p>&copy; {new Date().getFullYear()} [您的名字]. All rights reserved.</p>
        <p>本網站由 AWS CodePipeline 自動部署。</p>
      </footer>
    </div>
  );
}

export default PersonalWebsite;