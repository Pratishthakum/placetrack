import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../config';
import { useAuth } from '../context/AuthContext';
import { Logo, Sun, Moon, Logout } from './Icons';

const THEME_KEY = 'placetrack_theme';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <Logo />
          <span>{APP_NAME}</span>
        </Link>

        <nav className="nav-links">
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
              <NavLink to="/insights" className={({ isActive }) => (isActive ? 'active' : '')}>Insights</NavLink>
              <NavLink to="/resources" className={({ isActive }) => (isActive ? 'active' : '')}>Resources</NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" title="Toggle theme">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
          {user ? (
            <>
              <div className="avatar" title={user.email}>{user.name.charAt(0).toUpperCase()}</div>
              <button className="btn btn-ghost" onClick={handleLogout}><Logout /> <span className="hide-sm">Log out</span></button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Log in</Link>
              <Link className="btn btn-primary" to="/signup">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
