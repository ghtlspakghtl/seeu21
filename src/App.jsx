import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // 날짜별/시간대별 상태 관리 (기본값: 모두 '가능')
  const [scheduleData, setScheduleData] = useState(() => {
    const saved = localStorage.getItem('scheduleData');
    if (saved) return JSON.parse(saved);
    return {
      '11월 02일': { 아침: '가능', 방과후: '가능' },
      '11월 03일': { 아침: '가능', 방과후: '가능' },
      '11월 04일': { 아침: '가능', 방과후: '가능' },
      '11월 05일': { 아침: '가능', 방과후: '가능' },
      '11월 06일': { 아침: '가능', 방과후: '가능' },
    };
  });

  const [tempSchedule, setTempSchedule] = useState(scheduleData);
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

  const handleStatusToggle = (date, timeSlot) => {
    setTempSchedule(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [timeSlot]: prev[date][timeSlot] === '가능' ? '불가능' : '가능'
      }
    }));
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    setScheduleData(tempSchedule);
    localStorage.setItem('scheduleData', JSON.stringify(tempSchedule));
    alert('참여 가능 일정이 수정되었습니다.');
  };

  // 전체 중 하나라도 '가능'한 슬롯이 있는지 확인 (모두 불가능하면 신청 불가)
  const isAnyAvailable = Object.values(scheduleData).some(
    slot => slot.아침 === '가능' || slot.방과후 === '가능'
  );

  const dates = ['11월 02일', '11월 03일', '11월 04일', '11월 05일', '11월 06일'];
  const timeSlots = ['아침', '방과후'];

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
            <p className="admin-notice">클릭해서 '가능 / 불가능' 상태를 변경하세요.</p>
            <div className="table-responsive">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    {dates.map(date => <th key={date}>{date}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(slot => (
                    <tr key={slot}>
                      <td><strong>{slot}</strong></td>
                      {dates.map(date => {
                        const status = tempSchedule[date][slot];
                        return (
                          <td 
                            key={date} 
                            onClick={() => handleStatusToggle(date, slot)}
                            className={`clickable-cell ${status === '불가능' ? 'impossible' : 'possible'}`}
                          >
                            {status}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleSaveSchedule} className="save-btn">저장하기</button>
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
          <h2>주인공 폰</h2>
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
        <h3>참여 가능 일정표 (11월 2일 ~ 11월 6일)</h3>
        
        <div className="table-responsive" style={{ margin: '20px 0' }}>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>날짜</th>
                {dates.map(date => <th key={date}>{date}</th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot}>
                  <td><strong>{slot}</strong></td>
                  {dates.map(date => {
                    const status = scheduleData[date][slot];
                    return (
                      <td key={date} className={status === '불가능' ? 'impossible' : 'possible'}>
                        {status}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px' }}>
          {isAnyAvailable ? (
            <a 
              href="https://forms.gle/UmbvnMtuZwSFnEd27" 
              target="_blank" 
              rel="noopener noreferrer"
              className="apply-btn"
            >
              참가 신청하기
            </a>
          ) : (
            <button className="apply-btn disabled" disabled style={{ background: '#484f58', cursor: 'not-allowed' }}>
              신청불가 (현재 가능한 일정이 없습니다)
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
