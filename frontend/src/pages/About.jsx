import { useEffect, useState } from 'react';
import api from '../api';

export default function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('site-settings/').then(res => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginTop: 0 }}>
        {settings?.about_heading || 'Our Story'}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginTop: '2rem',
        }}
      >
        <div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#444' }}>
            {settings?.about_text ||
              'We offer two container units and a collection of modern capsule houses on a secluded forest property. Each unit is designed for real rest — clean lines, warm wood, and big windows onto the trees.'}
          </p>
        </div>
        {settings?.about_image ? (
          <img
            src={settings.about_image}
            alt="About us"
            style={{
              width: '100%',
              borderRadius: '10px',
              objectFit: 'cover',
              maxHeight: '400px',
            }}
          />
        ) : (
          <div
            style={{
              background: '#e5e2da',
              height: '320px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
            }}
          >
            (Add an image in Site Settings)
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginTop: '4rem',
          textAlign: 'center',
        }}
      >
        {[
          { number: '5', label: 'Units on 40 acres' },
          { number: '2,400+', label: 'Happy guests' },
          { number: '4.9★', label: 'Average rating' },
        ].map(s => (
          <div key={s.label}>
            <p
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#2c5f2d',
                margin: '0 0 0.25rem',
              }}
            >
              {s.number}
            </p>
            <p style={{ margin: 0, color: '#666' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}