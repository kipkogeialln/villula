import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [cabins, setCabins] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('cabins/').then(res => setCabins(res.data.slice(0, 3)));
    api.get('site-settings/').then(res => setSettings(res.data));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh', // Taller hero for better impact
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
          // Using your local image, with a dark gradient overlay for text readability
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('/hero.jpg') center/cover no-repeat`,
        }}
      >
        <div style={{ padding: '2rem', maxWidth: '800px', marginTop: '4rem' }}>
          {/* Small accent text */}
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '0.85rem', 
            fontWeight: 'bold',
            color: '#e0c27a', // Gold/yellow accent to match the container roof
            marginBottom: '1rem'
          }}>
            Modern Micro-Stays
          </p>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              margin: '0 0 1rem',
              lineHeight: 1.1,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Stay in Design-Led Capsules & Containers
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            marginBottom: '2.5rem', 
            opacity: 0.95,
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}>
            Architectural micro-stays tucked into the trees — modern comfort, total seclusion.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/cabins"
              style={{
                background: '#2c5f2d',
                color: '#fff',
                padding: '0.9rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.05rem',
                transition: 'background 0.2s',
              }}
            >
              Explore Our Units
            </Link>
            <Link
              to="/about"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '0.9rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.05rem',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {[
            {
              icon: '🏗️',
              title: 'Container & capsule builds',
              text: 'Two container units and a set of modern capsule houses.',
            },
            {
              icon: '🛁',
              title: 'Private hot tubs',
              text: 'Soak under the stars after a day of hiking.',
            },
            {
              icon: '🌲',
              title: 'Secluded forest setting',
              text: 'No neighbors in sight — just trees and birdsong.',
            },
            {
              icon: '🐕',
              title: 'Pet-friendly',
              text: 'Bring the whole family, four-legged members included.',
            },
          ].map(f => (
            <div key={f.title}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#666', margin: 0, lineHeight: 1.6 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured units */}
      <section style={{ background: '#f7f5f0', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>Featured Units</h2>
              <p style={{ margin: 0, color: '#666' }}>Hand-picked stays for your next escape.</p>
            </div>
            <Link to="/cabins" style={{ color: '#2c5f2d', fontWeight: '600', textDecoration: 'none' }}>
              View all units →
            </Link>
          </div>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {cabins.map(cabin => (
              <Link
                key={cabin.id}
                to={`/cabins/${cabin.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, boxShadow 0.2s',
                }}
              >
                {cabin.primary_image && (
                  <img
                    src={cabin.primary_image}
                    alt={cabin.name}
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}
                <div style={{ padding: '1.5rem' }}>
                  <span
                    style={{
                      background: cabin.unit_type === 'container' ? '#2c5f2d' : '#8a6a4b',
                      color: '#fff',
                      fontSize: '0.72rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'inline-block',
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {cabin.unit_type === 'container' ? 'Container Unit' : 'Capsule House'}
                  </span>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem' }}>{cabin.name}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    ${cabin.price_per_night} / night · Sleeps {cabin.max_guests}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section
        style={{
          background: '#1f2a24',
          color: '#fff',
          textAlign: 'center',
          padding: '4rem 1.5rem',
        }}
      >
        <h2 style={{ margin: '0 0 1rem', fontSize: '2rem' }}>Ready to experience micro-living?</h2>
        <p style={{ margin: '0 0 2rem', opacity: 0.8, fontSize: '1.1rem' }}>
          Book directly with us for the best rates and exclusive perks.
        </p>
        <Link
          to="/cabins"
          style={{
            background: '#e0c27a',
            color: '#1f2a24',
            padding: '0.9rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.05rem'
          }}
        >
          Check Availability
        </Link>
      </section>
    </>
  );
}