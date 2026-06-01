import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your workforce analytics' },
  '/employees': { title: 'Employees', subtitle: 'Manage your workforce' },
  '/reports': { title: 'Reports', subtitle: 'Generate and download reports' }
};

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'HR Analytics', subtitle: '' };

  return (
    <div className="topbar">
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>
          {page.title}
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{page.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Date */}
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 38, height: 38, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            cursor: 'pointer', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition)'
          }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}
