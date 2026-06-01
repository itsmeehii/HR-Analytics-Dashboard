import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '0.88rem',
      fontWeight: isActive ? '600' : '400',
      color: isActive ? 'var(--color-accent)' : 'var(--sidebar-text)',
      background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
      transition: 'all 0.2s ease',
      marginBottom: '2px'
    })}
    onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
    onMouseLeave={e => { if (!e.currentTarget.style.color.includes('accent')) e.currentTarget.style.background = 'transparent'; }}
  >
    <span style={{ fontSize: '1.1rem', opacity: 0.9 }}>{icon}</span>
    {label}
  </NavLink>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--sidebar-bg)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '0 16px',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      zIndex: 200
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, color: '#0f1624', fontFamily: 'var(--font-display)'
          }}>H</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', lineHeight: 1.1 }}>HRAnalytics</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--sidebar-text)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: '20px' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Main Menu</div>
        <NavItem to="/" end icon="⬡" label="Dashboard" />
        <NavItem to="/employees" icon="👥" label="Employees" />
        <NavItem to="/reports" icon="📊" label="Reports" />
      </nav>

      {/* User Profile */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', marginBottom: '8px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--sidebar-text)' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--sidebar-text)', fontSize: '0.82rem' }}>
          ↩ Logout
        </button>
      </div>
    </aside>
  );
}
