import { useEffect, useState } from 'react';
import api from '../api';

const cardStyle = {
  background: '#fff', padding: '1.5rem', borderRadius: '8px',
  border: '1px solid #e0e0e0',
};

export default function DashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('admin/stats/').then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading…</p>;

  const cards = [
    { label: 'Total bookings', value: stats.total_bookings },
    { label: 'Pending', value: stats.pending_bookings },
    { label: 'Confirmed', value: stats.confirmed_bookings },
    { label: 'Upcoming check-ins', value: stats.upcoming_checkins },
    { label: 'Total revenue', value: `$${stats.total_revenue.toFixed(2)}` },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {cards.map(c => (
          <div key={c.label} style={cardStyle}>
            <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>{c.label}</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', fontWeight: 'bold' }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}