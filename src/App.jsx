import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [availableDate, setAvailableDate] = useState(() => {
    return localStorage.getItem('availableDate') || '2026년 10월 10일 ~ 2026년 10월 20일';
  });
  const [tempDate, setTempDate] = useState(availableDate);

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
    if (passwordInput === 'ILovebuki0321!') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸어.');
    }
  };

  const handleSaveDate = (e) => {
    e.preventDefault();
    setAvailableDate(tempDate);
    localStorage.setItem('availableDate', tempDate);
    alert('참여 가능 날짜가 수정되었어.');
  };

  if (isAdminMode) {
    return (
      <div className="admin-container">
        <h1>관리자 전용 페이지</h1>
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="login-form">
            <p>관리자 로그인이 필요합니다.</p>
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
        <h1>프로젝트 영상 및 일정 안내</h1>
        <a href="#admin" className="admin-link">관리자 로그인</a>
      </header>

      <main className="video-grid">
        <section className="video-card">
          <h2>영상 1</h2>
          <video controls width="100%">
            <source src="/1.mp4" type="video/mp4" />
            브라우저가 동영상 재생을 지원하지 않습니다.
          </video>
        </section>

        <section className="video-card">
          <h2>영상 2</h2>
          <video controls width="100%">
            <source src="/2.mp4" type="video/mp4" />
            브라우저가 동영상 재생을 지원하지 않습니다.
          </video>
        </section>

        <section className="video-card">
          <h2>영상 3</h2>
          <video controls width="100%">
            <source src="/3.mp4" type="video/mp4" />
            브라우저가 동영상 재생을 지원하지 않습니다.
          </video>
        </section>
      </main>

      <section className="info-section">
        <h3>참여 가능 날짜</h3>
        <p className="highlight-date">{availableDate}</p>
        <div style={{ marginTop: '15px' }}>
          <a 
            href="https://forms.gle/UmbvnMtuZwSFnEd27" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            참가 신청하기
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
