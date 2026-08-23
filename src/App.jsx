import './App.css';

export default function App() {
  const GOOGLE_FORM_URL = "https://forms.gle/joL7ZUq6V7AAoSkd7";

  return (
    <div className="container">
      <div className="card">
        <h1>수학체험부 방탈출 행사</h1>
        <p className="description">
          아래 버튼을 눌러 참가 신청서를 작성해 주세요.
        </p>

        <a 
          href={GOOGLE_FORM_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="submit-btn"
        >
          참가 신청하기
        </a>
      </div>
    </div>
  );
}