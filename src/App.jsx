import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [availableDate, setAvailableDate] = useState(() => {
    return localStorage.getItem('availableDate') || '2026년 11월 2일 ~ 2026년 11월 6일';
  });
  const [tempDate, setTempDate] = useState(availableDate);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'ILOVEbuki0321!') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다. 3회 틀릴 경우 메일 발송됩니다.');
    }
  };

  const handleSaveDate = (e) => {
    e.preventDefault();
    localStorage.setItem('availableDate', tempDate);
    setAvailableDate(tempDate);
    alert('참여 가능 날짜가 수정되었습니다.');
  };

  if (isAdminMode) {
    return (
      <div className="admin-container">
        <h1>관리자 전용 페이지</h1>
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="login-form">
            <p>관리자 로그인</p>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button type="submit">로그인</button>
          </form>
        ) : (
          <div className="admin-dashboard">
            <form onSubmit={handleSaveDate} className="edit-form">
              <label>참여 가능 날짜 수정</label>
              <input
                type="text"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />
              <button type="submit">저장하기</button>
            </form>
            <button className="back-btn" onClick={() => window.location.hash = ''}>
              메인 화면으로 돌아가기
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>프로젝트 아카이브 및 일정</h1>
        <a href="#admin" className="admin-link">관리자 로그인</a>
      </header>

      <main className="content-grid">
        <section className="media-card phone-card">
          <h2>당시 경찰 폰</h2>
          <video controls width="100%">
            <source src="/주인공 폰.mp4" type="video/mp4" />
            브라우저가 동영상 재생을 지원하지 않습니다.
          </video>
        </section>

        <section className="media-card">
          <h2>경찰청 무전내용</h2>
          <video controls width="100%">
            <source src="/경찰청 무전내용.mp4" type="video/mp4" />
            브라우저가 동영상 재생을 지원하지 않습니다.
          </video>
        </section>

        <section className="media-card clickable" onClick={() => setIsModalOpen(true)}>
          <h2>관련 뉴스 자료 (클릭해서 확대)</h2>
          <img src="/news.png" alt="뉴스 자료" className="preview-img" />
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src="/news.png" alt="뉴스 자료 확대" />
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      <section className="info-section">
        <h3>참여 가능 날짜</h3>
        <p className="highlight-date">{availableDate}</p>
        <div style={{ marginTop: '15px' }}>
          <a 
            href="https://forms.gle/UmbvnMtuZwSFnEd27" 
            target="_blank" 
            rel="noopener noreferrer"
            className="apply-btn"
          >
            참가 신청하기
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
