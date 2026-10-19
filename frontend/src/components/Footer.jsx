import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('site-settings/').then(res => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <footer style={{ background: '#1f2a24', color: '#d5d5d5', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: '#fff', marginTop: 0 }}>🏕️ Villula Cabins</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
            Cozy cabins nestled in the woods. Unplug, unwind, and reconnect with nature.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff' }}>Explore</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', lineHeight: 2 }}>
            <li><Link to="/" style={{ color: '#d5d5d5', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/about" style={{ color: '#d5d5d5', textDecoration: 'none' }}>About Us</Link></li>
            <li><Link to="/cabins" style={{ color: '#d5d5d5', textDecoration: 'none' }}>Units</Link></li>
            <li><Link to="/contact" style={{ color: '#d5d5d5', textDecoration: 'none' }}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff' }}>Contact</h4>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, margin: 0 }}>
            {settings?.contact_address && <>{settings.contact_address}<br /></>}
            {settings?.contact_phone && <>📞 {settings.contact_phone}<br /></>}
            {settings?.contact_email && <>✉️ {settings.contact_email}</>}
          </p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #2f3a33', textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: '#888' }}>
        © {new Date().getFullYear()} Pinewood Cabins. All rights reserved.
      </div>
    </footer>
  );
}