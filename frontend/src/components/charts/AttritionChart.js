import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)'
      }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-red)' }}>
          Attrition: <strong>{payload[0]?.value}%</strong>
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          {payload[1]?.value} inactive / {payload[2]?.value} total
        </p>
      </div>
    );
  }
  return null;
};

export default function AttritionChart({ data, loading }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Attrition by Department</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Rate of employee turnover</p>
      </div>

      {loading ? (
        <div className="loading-center" style={{ padding: '40px 0' }}><div className="spinner" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis unit="%" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={10} stroke="var(--color-red)" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Bar dataKey="attritionRate" name="Attrition Rate" radius={[6, 6, 0, 0]}
              fill="var(--color-red)" opacity={0.8} />
            {/* Hidden bars for tooltip data */}
            <Bar dataKey="inactive" hide />
            <Bar dataKey="total" hide />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
