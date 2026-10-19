import { useEffect, useState } from 'react';
import api from '../api';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    api.get('site-settings/').then(res => setSettings(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('contact/', form);
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = { padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', width: '100%' };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginTop: 0 }}>Contact Us</h1>
      <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        Questions about a booking? Need help planning your stay? We'd love to hear from you.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
        {/* Contact info */}
        <div>
          <h2 style={{ marginTop: 0 }}>Get in touch</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2, color: '#444' }}>
            {settings?.contact_address && (
              <li>📍 {settings.contact_address}</li>
            )}
            {settings?.contact_phone && (
              <li>📞 <a href={`tel:${settings.contact_phone}`} style={{ color: '#2c5f2d' }}>{settings.contact_phone}</a></li>
            )}
            {settings?.contact_email && (
              <li>✉️ <a href={`mailto:${settings.contact_email}`} style={{ color: '#2c5f2d' }}>{settings.contact_email}</a></li>
            )}
          </ul>

          {settings?.map_embed_url && (
            <div style={{ marginTop: '1.5rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
              <iframe
                src={settings.map_embed_url}
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                title="Resort location"
              />
            </div>
          )}
        </div>

        {/* Contact form */}
        <div>
          <h2 style={{ marginTop: 0 }}>Send us a message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required style={inputStyle} />
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required style={inputStyle} />
            <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} style={inputStyle} />
            <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} style={inputStyle} />
            <textarea name="message" placeholder="Your message" value={form.message} onChange={handleChange} required style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} />

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                background: '#2c5f2d', color: '#fff', padding: '0.85rem 1.5rem',
                borderRadius: '6px', border: 'none', fontSize: '1rem',
                fontWeight: '600', cursor: status === 'sending' ? 'wait' : 'pointer',
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>

            {status === 'sent' && <p style={{ color: '#2c5f2d', margin: 0 }}>✅ Thanks! We'll get back to you within 24 hours.</p>}
            {status === 'error' && <p style={{ color: '#b00', margin: 0 }}>❌ Something went wrong. Please try again or email us directly.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}