import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  textDecoration: 'none',
  color: isActive ? '#fff' : '#333',
  background: isActive ? '#2c5f2d' : 'transparent',
});

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <aside style={{ width: '230px', background: '#fff', borderRight: '1px solid #e0e0e0', padding: '1.5rem 1rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>🏕️ Admin</h2>
        <nav style={{ display: 'grid', gap: '0.25rem' }}>
          <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>
          <NavLink to="/admin/bookings" style={linkStyle}>Bookings</NavLink>
          <NavLink to="/admin/cabins" style={linkStyle}>Cabins</NavLink>
        </nav>
        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          style={{ width: '100%', padding: '0.5rem', cursor: 'pointer' }}
        >
          Log out
        </button>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}