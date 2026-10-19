import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
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

export default function CabinDetail() {
  const { slug } = useParams();
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Calendar state
  const [bookedDates, setBookedDates] = useState([]);
  const [range, setRange] = useState({ from: undefined, to: undefined });

  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    guests: 1,
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch cabin details AND availability
  useEffect(() => {
    setLoading(true);
    api.get(`cabins/${slug}/`)
      .then(res => {
        setCabin(res.data);
        // Fetch availability using the cabin ID
        return api.get(`cabins/${res.data.id}/availability/`);
      })
      .then(res => {
        // Convert booked ranges into an array of disabled dates
        const disabled = [];
        res.data.forEach(booking => {
          const start = new Date(booking.check_in);
          const end = new Date(booking.check_out);
          // Add every date between check_in and check_out to the disabled array
          for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            disabled.push(new Date(d));
          }
        });
        setBookedDates(disabled);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!range.from || !range.to) {
      setMessage('❌ Please select check-in and check-out dates from the calendar.');
      return;
    }

    setMessage('');
    setSubmitting(true);

    // Format dates to YYYY-MM-DD for the Django backend
    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    };

    try {
      await api.post('bookings/', {
        ...form,
        cabin: cabin.id,
        guests: Number(form.guests),
        check_in: formatDate(range.from),
        check_out: formatDate(range.to),
      });
      
      setMessage('✅ Booking request received! We will contact you shortly.');
      setForm({ guest_name: '', guest_email: '', guest_phone: '', guests: 1 });
      setRange({ from: undefined, to: undefined });
      
      // Refresh availability after booking
      api.get(`cabins/${cabin.id}/availability/`).then(res => {
        const disabled = [];
        res.data.forEach(booking => {
          const start = new Date(booking.check_in);
          const end = new Date(booking.check_out);
          for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            disabled.push(new Date(d));
          }
        });
        setBookedDates(disabled);
      });

    } catch (err) {
      const detail = err.response?.data;
      const text = typeof detail === 'object' ? JSON.stringify(detail) : 'Something went wrong.';
      setMessage('❌ ' + text);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: '4rem', textAlign: 'center' }}>Loading…</p>;
  if (!cabin) return <p style={{ padding: '4rem', textAlign: 'center' }}>Unit not found.</p>;

  const inputStyle = {
    padding: '0.6rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <Link to="/cabins" style={{ color: '#2c5f2d', textDecoration: 'none', fontSize: '0.95rem' }}>
        ← Back to all units
      </Link>

      <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <span style={badgeStyle(cabin.unit_type)}>
          {cabin.unit_type === 'container' ? 'Container Unit' : 'Capsule House'}
        </span>
        <h1 style={{ margin: '0.6rem 0 1rem', fontSize: '2.4rem' }}>{cabin.name}</h1>
        <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>{cabin.description}</p>
      </div>

      {/* Main Grid: Images & Details on left, Booking on right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        
        {/* Left Column: Images & Features */}
        <div>
          {cabin.images && cabin.images.length > 0 && (
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              <img
                src={cabin.images.find(i => i.is_primary)?.image || cabin.images[0].image}
                alt={cabin.name}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '10px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {cabin.images.slice(1, 3).map(img => (
                  <img key={img.id} src={img.image} alt={img.alt_text || cabin.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                ))}
              </div>
            </div>
          )}

          <h3 style={{ marginTop: 0 }}>What this unit offers</h3>
          {cabin.unit_type === 'container' ? (
            <ul style={{ paddingLeft: '1.2rem', color: '#444', lineHeight: 1.9 }}>
              <li>Converted shipping-container build</li>
              <li>Industrial finish with warm wood interior</li>
              <li>Wraparound outdoor terrace</li>
            </ul>
          ) : (
            <ul style={{ paddingLeft: '1.2rem', color: '#444', lineHeight: 1.9 }}>
              <li>Modern capsule design</li>
              <li>Floor-to-ceiling forest-facing glazing</li>
              <li>Skylight above the bed</li>
            </ul>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '2rem', padding: '1.25rem', background: '#f7f5f0', borderRadius: '10px' }}>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Price</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>${cabin.price_per_night}/night</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Sleeps</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{cabin.max_guests}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Bedrooms</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{cabin.bedrooms}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Bathrooms</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{cabin.bathrooms}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form & Calendar */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Book this unit</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={[{ before: new Date() }, ...bookedDates]}
              fromMonth={new Date()}
              modifiers={{ booked: bookedDates }}
              modifiersStyles={{ booked: { textDecoration: 'line-through', color: '#ccc' } }}
              style={{ margin: 0 }}
            />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#2c5f2d', background: '#eef3ee', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
              <strong>Selected:</strong> 
              <span>
                {range.from ? range.from.toLocaleDateString() : 'Check-in'} → {range.to ? range.to.toLocaleDateString() : 'Check-out'}
              </span>
            </div>

            <input name="guest_name" placeholder="Your name" value={form.guest_name} onChange={handleChange} style={inputStyle} required />
            <input name="guest_email" type="email" placeholder="Email address" value={form.guest_email} onChange={handleChange} style={inputStyle} required />
            <input name="guest_phone" placeholder="Phone (optional)" value={form.guest_phone} onChange={handleChange} style={inputStyle} />
            
            <label style={{ display: 'grid', gap: '0.25rem', fontSize: '0.85rem', color: '#555' }}>
              Guests
              <input name="guests" type="number" min="1" max={cabin.max_guests} value={form.guests} onChange={handleChange} style={inputStyle} required />
            </label>
            
            <button
              type="submit"
              disabled={submitting || !range.from || !range.to}
              style={{
                background: (!range.from || !range.to) ? '#ccc' : '#2c5f2d',
                color: '#fff',
                padding: '0.85rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: (submitting || !range.from || !range.to) ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                transition: 'background 0.2s'
              }}
            >
              {submitting ? 'Sending…' : 'Request Booking'}
            </button>
          </form>
          
          {message && (
            <p style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', background: message.startsWith('✅') ? '#eef3ee' : '#fdeaea', color: message.startsWith('✅') ? '#2c5f2d' : '#b00', fontSize: '0.9rem' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}