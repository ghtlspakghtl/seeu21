import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, collection, addTimestamp } from 'firebase/firestore';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyCq1ixjy0orxEhiPFa4wcLG83ryVw15-j0",
  authDomain: "seeu21-28870.firebaseapp.com",
  projectId: "seeu21-28870",
  storageBucket: "seeu21-28870.firebasestorage.app",
  messagingSenderId: "940350747489",
  appId: "1:940350747489:web:1669d1e8f2b85ca7dd8b20",
  measurementId: "G-4MVLDT84NN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultSchedule = {
  '11월 02일': { 아침: '가능', 방과후: '가능' },
  '11월 03일': { 아침: '가능', 방과후: '가능' },
  '11월 04일': { 아침: '가능', 방과후: '가능' },
  '11월 05일': { 아침: '가능', 방과후: '가능' },
  '11월 06일': { 아침: '가능', 방과후: '가능' },
};

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [scheduleData, setScheduleData] = useState(defaultSchedule);
  const [tempSchedule, setTempSchedule] = useState(defaultSchedule);
  
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  
  // 참가 신청 모달 상태
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ date: '', timeSlot: '' });
  const [applicantName, setApplicantName] = useState('');
  const [applicantContact, setApplicantContact] = useState('');

  // 파이어베이스 실시간 리스너
  useEffect(() => {
    const docRef = doc(db, 'schedules', 'project_schedule');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setScheduleData(data);
        setTempSchedule(data);
      } else {
        setDoc(docRef, defaultSchedule);
      }
    }, (error) => {
      console.error("실시간 데이터 동기화 에러:", error);
    });

    return () => unsubscribe();
  }, []);

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

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'schedules', 'project_schedule');
      await setDoc(docRef, tempSchedule);
      alert('서버에 저장되어 모든 사용자에게 실시간 반영되었습니다.');
    } catch (error) {
      console.error("저장 실패:", error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 사용자 일정 클릭 시 신청 모달 열기 (가능한 경우만)
  const handleCellClick = (date, timeSlot) => {
    if (scheduleData[date][timeSlot] === '가능') {
      setSelectedSlot({ date, timeSlot });
      setApplicantName('');
      setApplicantContact('');
      setIsApplyModalOpen(true);
    } else {
      alert('이미 마감되었거나 신청할 수 없는 시간대입니다.');
    }
  };

  // 신청 제출 시 파이어베이스 업데이트 (해당 슬롯 '불가능'으로 변경 + 신청자 기록)
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    try {
      const { date, timeSlot } = selectedSlot;
      
      // 1. 해당 시간대 '불가능'으로 변경
      const updatedSchedule = {
        ...scheduleData,
        [date]: {
          ...scheduleData[date],
          [timeSlot]: '불가능'
        }
      };

      const docRef = doc(db, 'schedules', 'project_schedule');
      await setDoc(docRef, updatedSchedule);

      // 2. 신청자 명단에 저장 (선택 사항: applicants 컬렉션에 추가)
      const applicantRef = doc(db, 'applicants', `${date}_${timeSlot}_${Date.now()}`);
      await setDoc(applicantRef, {
        date,
        timeSlot,
        name: applicantName,
        contact: applicantContact,
        appliedAt: new Date().toISOString()
      });

      alert(`[${date} ${timeSlot}] 신청이 완료되었습니다!`);
      setIsApplyModalOpen(false);
    } catch (error) {
      console.error("신청 실패:", error);
      alert('신청 중 오류가 발생했습니다.');
    }
  };

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
                        const status = tempSchedule[date]?.[slot] || '가능';
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
            <button onClick={handleSaveSchedule} className="save-btn">서버에 저장하기</button>
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
          <div className="video-wrapper vertical">
            <video controls>
              <source src="/주인공 폰.mp4" type="video/mp4" />
              브라우저가 동영상 재생을 지원하지 않습니다.
            </video>
          </div>
        </section>

        <section className="media-card">
          <h2>경찰청 무전내용</h2>
          <div className="video-wrapper horizontal">
            <video controls>
              <source src="/경찰청 무전내용.mp4" type="video/mp4" />
              브라우저가 동영상 재생을 지원하지 않습니다.
            </video>
          </div>
        </section>

        <section className="media-card clickable" onClick={() => setIsNewsModalOpen(true)}>
          <h2>관련 뉴스 자료 (클릭해서 확대)</h2>
          <div className="img-wrapper">
            <img src="/news.png" alt="뉴스 자료" className="preview-img" />
          </div>
        </section>
      </main>

      {/* 뉴스 이미지 확대 모달 */}
      {isNewsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src="/news.png" alt="뉴스 자료 확대" />
            <button className="close-btn" onClick={() => setIsNewsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* 참가 신청 팝업 모달 */}
      {isApplyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal-content apply-modal" onClick={(e) => e.stopPropagation()}>
            <h3>참가 신청하기</h3>
            <p className="selected-slot-info">
              선택한 일정: <strong>{selectedSlot.date} ({selectedSlot.timeSlot})</strong>
            </p>
            <form onSubmit={handleApplySubmit} className="apply-form">
              <label>이름</label>
              <input 
                type="text" 
                placeholder="이름을 입력하세요" 
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
              />
              <label>연락처 (또는 학번)</label>
              <input 
                type="text" 
                placeholder="연락처나 학번을 입력하세요" 
                value={applicantContact}
                onChange={(e) => setApplicantContact(e.target.value)}
              />
              <button type="submit" className="submit-btn">신청 완료하기</button>
            </form>
            <button className="close-btn" onClick={() => setIsApplyModalOpen(false)}>취소</button>
          </div>
        </div>
      )}

      <section className="info-section">
        <h3>참여 가능 일정표 (원하는 날짜를 클릭하여 신청하세요)</h3>
        
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
                    const status = scheduleData[date]?.[slot] || '가능';
                    return (
                      <td 
                        key={date} 
                        onClick={() => handleCellClick(date, slot)}
                        className={`user-clickable-cell ${status === '불가능' ? 'impossible' : 'possible'}`}
                        title={status === '가능' ? '클릭하여 신청하기' : '마감됨'}
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
      </section>
    </div>
  );
}

export default App;
