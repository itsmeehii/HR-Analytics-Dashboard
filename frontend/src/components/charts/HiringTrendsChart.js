import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)'
      }}>
        <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{label}</p>
        <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)', marginTop: 2 }}>
          {payload[0].value} hired
        </p>
      </div>
    );
  }
  return null;
};

export default function HiringTrendsChart({ data, loading }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Monthly Hiring Trends</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Last 12 months</p>
      </div>

      {loading ? (
        <div className="loading-center" style={{ padding: '40px 0' }}><div className="spinner" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hiringGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="hired" name="Hired"
              stroke="#f59e0b" strokeWidth={2.5}
              fill="url(#hiringGradient)"
              dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
