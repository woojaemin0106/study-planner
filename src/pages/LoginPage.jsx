import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="이메일 주소를 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '처리 중...' : '로그인'}
          </button>
        </form>
        <div className="auth-footer">
          계정이 없으신가요? 
          <Link to="/signup" className="auth-link">지금 가입 하세요</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
