import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './Login.css';
import logo from '../assets/logo-wc.png';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);

  const isSignup = mode === 'signup';

  function clearMessages() {
    setError('');
    setMessage('');
  }

  function toggleMode() {
    clearMessages();
    setConfirm('');
    setMode(isSignup ? 'login' : 'signup');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearMessages();

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (isSignup && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (isSignup && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    if (isSignup) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('Account created! You can now log in.');
        setMode('login');
        setPassword('');
        setConfirm('');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/');
      }
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-page__circle login-page__circle--1" />
      <div className="login-page__circle login-page__circle--2" />
      <div className="login-page__circle login-page__circle--3" />

      <div className="login-card">

        <div className="login-card__logo">
          <img src={logo} alt="Workout_Coach" className="login-card__logo-img" />
        </div>

        <div className="login-card__header">
          <h1 className="login-card__title">
            {isSignup ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="login-card__subtitle">
            {isSignup
              ? 'Start tracking your workouts today.'
              : 'Log in to see your progress.'}
          </p>
        </div>

        {message && (
          <div className="login-card__message login-card__message--success">
            {message}
          </div>
        )}

        {error && (
          <div className="login-card__message login-card__message--error">
            {error}
          </div>
        )}

        <div className="login-card__form">

          <div className="form-field">
            <label className="form-field__label label-caps" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-field__input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-field__label label-caps" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-field__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              disabled={loading}
            />
          </div>

          {isSignup && (
            <div className="form-field">
              <label className="form-field__label label-caps" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                className="form-field__input"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          )}

          <button
            className="login-card__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'}
          </button>

        </div>

        <p className="login-card__toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            className="login-card__toggle-btn"
            onClick={toggleMode}
            disabled={loading}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>

      </div>
    </div>
  );
}