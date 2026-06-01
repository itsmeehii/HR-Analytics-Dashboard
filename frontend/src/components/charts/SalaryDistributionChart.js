import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#f97316', '#14b8a6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)'
      }}>
        <p style={{ fontWeight: 700, color: payload[0].payload.fill }}>{payload[0].name}</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
          {payload[0].value} employees
        </p>
      </div>
    );
  }
  return null;
};

export default function SalaryDistributionChart({ data, loading }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Salary Distribution</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>By salary range</p>
      </div>

      {loading ? (
        <div className="loading-center" style={{ padding: '40px 0' }}><div className="spinner" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="range" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3}>
              {data?.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
