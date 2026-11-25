import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Logo } from './Icons';

// One component powers both the Login and Signup pages.
export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { user, login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      toast(isSignup ? 'Account created. Welcome aboard!' : 'Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <aside className="auth-side">
        <Logo size={44} />
        <h2>{isSignup ? 'Organise your placement hunt.' : 'Good to see you again.'}</h2>
        <p>
          {isSignup
            ? 'Add companies, track every round and never miss a deadline.'
            : 'Pick up right where you left off. Your pipeline is waiting.'}
        </p>
        <div className="auth-blob" />
      </aside>

      <section className="auth-main">
        <form className="auth-card" onSubmit={onSubmit}>
          <h1>{isSignup ? `Create your ${APP_NAME} account` : 'Log in'}</h1>
          <p className="muted">{isSignup ? 'Takes less than a minute.' : 'Enter your details to continue.'}</p>

          {error && <div className="form-error" role="alert">{error}</div>}

          {isSignup && (
            <label className="field">
              <span>Full name</span>
              <input name="name" value={form.name} onChange={onChange} placeholder="Aarav Sharma" minLength={3} required autoFocus />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="you@college.edu" required autoFocus={!isSignup} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={onChange} placeholder={isSignup ? 'At least 6 characters' : 'Your password'} minLength={isSignup ? 6 : 1} required />
          </label>

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
          </button>

          <p className="auth-switch">
            {isSignup ? (<>Already have an account? <Link to="/login">Log in</Link></>) : (<>New here? <Link to="/signup">Create an account</Link></>)}
          </p>
        </form>
      </section>
    </div>
  );
}
