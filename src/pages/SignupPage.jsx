import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('회원가입 성공! 이메일을 확인해 주세요.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="auth-input-group">
            <input
              type="email"
              className="auth-input"
              placeholder="이메일 주소를 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              type="password"
              className="auth-input"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>
        <div className="auth-footer">
          회원이신가요? 
          <Link to="/login" className="auth-link">지금 로그인 하세요</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
