import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#2c5f2d' : '#333',
  fontWeight: isActive ? '600' : '400',
  textDecoration: 'none',
  padding: '0.5rem 0.75rem',
  borderBottom: isActive ? '2px solid #2c5f2d' : '2px solid transparent',
});

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2c5f2d', fontSize: '1.35rem', fontWeight: 'bold' }}>
            🏕️ Villula Stays
        </Link>

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <NavLink to="/" end style={navLinkStyle}>Home</NavLink>
          <NavLink to="/about" style={navLinkStyle}>About Us</NavLink>
          <NavLink to="/cabins" style={navLinkStyle}>Our Units</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact Us</NavLink>
          <Link
            to="/cabins"
            style={{ marginLeft: '0.75rem', background: '#2c5f2d', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}