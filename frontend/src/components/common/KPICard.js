import React from 'react';

export default function KPICard({ title, value, subtitle, icon, color, trend, loading }) {
  const colorMap = {
    blue: { bg: 'var(--color-blue-light)', accent: 'var(--color-blue)' },
    green: { bg: 'var(--color-green-light)', accent: 'var(--color-green)' },
    red: { bg: 'var(--color-red-light)', accent: 'var(--color-red)' },
    amber: { bg: 'var(--color-accent-light)', accent: 'var(--color-accent)' },
    purple: { bg: 'var(--color-purple-light)', accent: 'var(--color-purple)' },
    teal: { bg: 'var(--color-teal-light)', accent: 'var(--color-teal)' }
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: c.accent, borderRadius: '16px 0 0 16px'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {title}
          </div>
          {loading ? (
            <div style={{ height: 36, width: 100, background: 'var(--color-border)', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
          ) : (
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1 }}>
              {value}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>{subtitle}</div>
          )}
          {trend !== undefined && !loading && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              marginTop: 8, fontSize: '0.75rem', fontWeight: 600,
              color: trend >= 0 ? 'var(--color-green)' : 'var(--color-red)'
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>

        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
