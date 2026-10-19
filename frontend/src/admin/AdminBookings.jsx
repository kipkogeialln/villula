import { useEffect, useState } from 'react';
import api from '../api';

const STATUSES = ['pending', 'confirmed', 'cancelled'];

const statusBadge = status => {
  const colors = { pending: '#f0ad4e', confirmed: '#2c5f2d', cancelled: '#999' };
  return {
    background: colors[status] || '#ccc',
    color: '#fff',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    textTransform: 'capitalize',
  };
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;
    api.get('admin/bookings/', { params })
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    await api.patch(`admin/bookings/${id}/`, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <div>
      <h1>Bookings</h1>

      <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="Search name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          style={{ padding: '0.5rem', flex: 1, minWidth: '200px' }}
        />
        <button onClick={load}>Search</button>
      </div>

      {loading ? <p>Loading…</p> : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'auto', border: '1px solid #e0e0e0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead style={{ background: '#fafafa' }}>
              <tr>
                {['Cabin', 'Guest', 'Check-in', 'Check-out', 'Nights', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '0.85rem', color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.75rem' }}>{b.cabin_name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div>{b.guest_name}</div>
                    <small style={{ color: '#777' }}>{b.guest_email}</small>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{b.check_in}</td>
                  <td style={{ padding: '0.75rem' }}>{b.check_out}</td>
                  <td style={{ padding: '0.75rem' }}>{b.nights}</td>
                  <td style={{ padding: '0.75rem' }}>${Number(b.total_price).toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={statusBadge(b.status)}>{b.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} style={{ padding: '0.3rem' }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}