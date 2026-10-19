import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const badgeStyle = type => ({
  background: type === 'container' ? '#2c5f2d' : '#8a6a4b',
  color: '#fff',
  fontSize: '0.72rem',
  padding: '0.2rem 0.65rem',
  borderRadius: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'inline-block',
  fontWeight: '600',
});

export default function Cabins() {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('cabins/')
      .then(res => setCabins(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginTop: 0, textAlign: 'center' }}>Our Units</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Choose between our container units and capsule houses.
      </p>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading units…</p>
      ) : cabins.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No units available yet. Check back soon!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {cabins.map(cabin => (
            <div key={cabin.id} style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
              {cabin.primary_image ? (
                <img src={cabin.primary_image} alt={cabin.name} style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: '240px', background: '#eee' }} />
              )}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={badgeStyle(cabin.unit_type)}>
                  {cabin.unit_type === 'container' ? 'Container Unit' : 'Capsule House'}
                </span>
                <h2 style={{ margin: '0.6rem 0 0.5rem', fontSize: '1.35rem' }}>{cabin.name}</h2>
                <p style={{ color: '#666', margin: '0 0 1rem', fontSize: '0.95rem' }}>
                  Sleeps {cabin.max_guests} · ${cabin.price_per_night}/night
                </p>
                <Link
                  to={`/cabins/${cabin.slug}`}
                  style={{
                    marginTop: 'auto',
                    background: '#2c5f2d',
                    color: '#fff',
                    padding: '0.7rem 1.2rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '600',
                  }}
                >
                  View & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}