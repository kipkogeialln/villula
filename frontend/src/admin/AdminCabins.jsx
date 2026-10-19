import { useEffect, useState } from 'react';
import api from '../api';

const emptyForm = {
  name: '',
  unit_type: 'capsule',
  description: '',
  price_per_night: '',
  max_guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  is_active: true,
};

const badgeStyle = type => ({
  background: type === 'container' ? '#2c5f2d' : '#8a6a4b',
  color: '#fff',
  fontSize: '0.7rem',
  padding: '0.15rem 0.55rem',
  borderRadius: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'inline-block',
  fontWeight: '600',
});

export default function AdminCabins() {
  const [cabins, setCabins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Image upload state (only used when editing an existing cabin)
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('admin/cabins/')
      .then(res => setCabins(res.data))
      .catch(err => setError(JSON.stringify(err.response?.data || err.message)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price_per_night: Number(form.price_per_night),
      max_guests: Number(form.max_guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
    };
    try {
      if (editingId) {
        await api.patch(`admin/cabins/${editingId}/`, payload);
      } else {
        await api.post('admin/cabins/', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message));
    }
  };

  const startEdit = cabin => {
    setEditingId(cabin.id);
    setForm({
      name: cabin.name,
      unit_type: cabin.unit_type,
      description: cabin.description,
      price_per_night: cabin.price_per_night,
      max_guests: cabin.max_guests,
      bedrooms: cabin.bedrooms,
      bathrooms: cabin.bathrooms,
      is_active: cabin.is_active,
    });
    setError('');
    setUploadFile(null);
    setUploadMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setUploadFile(null);
    setUploadMsg('');
    setError('');
  };

  const remove = async id => {
    if (!window.confirm('Delete this unit? This cannot be undone.')) return;
    try {
      await api.delete(`admin/cabins/${id}/`);
      if (editingId === id) cancelEdit();
      load();
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message));
    }
  };

  const uploadImage = async () => {
    if (!uploadFile || !editingId) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const data = new FormData();
      data.append('image', uploadFile);
      data.append('cabin', editingId);
      data.append('is_primary', 'false');
      await api.post('admin/cabin-images/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg('✅ Image uploaded.');
      setUploadFile(null);
      load();
    } catch (err) {
      setUploadMsg('❌ ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = {
    padding: '0.6rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'grid',
    gap: '0.25rem',
    fontSize: '0.8rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    fontWeight: '600',
  };

  return (
    <div>
      <h1>Units</h1>

      {/* ---------- Create / Edit form ---------- */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          margin: '1rem 0 2rem',
          display: 'grid',
          gap: '1rem',
        }}
      >
        <h2 style={{ margin: 0 }}>{editingId ? 'Edit unit' : 'Add new unit'}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
          <label style={labelStyle}>
            Name
            <input
              name="name"
              placeholder="e.g. Capsule No. 1 — Forest View"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>
          <label style={labelStyle}>
            Type
            <select
              name="unit_type"
              value={form.unit_type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="capsule">Capsule House</option>
              <option value="container">Container Unit</option>
            </select>
          </label>
        </div>

        <label style={labelStyle}>
          Description
          <textarea
            name="description"
            placeholder="Describe the unit…"
            value={form.description}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            required
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          <label style={labelStyle}>
            Price / night
            <input
              name="price_per_night"
              type="number"
              step="0.01"
              min="0"
              value={form.price_per_night}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>
          <label style={labelStyle}>
            Max guests
            <input
              name="max_guests"
              type="number"
              min="1"
              value={form.max_guests}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Bedrooms
            <input
              name="bedrooms"
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Bathrooms
            <input
              name="bathrooms"
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
          <input
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active (visible on public site)
        </label>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            style={{
              background: '#2c5f2d',
              color: '#fff',
              padding: '0.7rem 1.4rem',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {editingId ? 'Save changes' : 'Create unit'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: '0.7rem 1.4rem',
                border: '1px solid #ccc',
                background: '#fff',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p style={{ color: '#b00', margin: 0 }}>{error}</p>}
      </form>

      {/* ---------- Image upload (edit mode only) ---------- */}
      {editingId && (
        <div
          style={{
            background: '#fff',
            padding: '1.25rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            margin: '0 0 2rem',
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          <h3 style={{ margin: 0 }}>Add an image to this unit</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
            Uploads are added to the gallery. To set a primary image, use Django admin.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              accept="image/*"
              onChange={e => setUploadFile(e.target.files?.[0] || null)}
            />
            <button
              type="button"
              onClick={uploadImage}
              disabled={!uploadFile || uploading}
              style={{
                background: '#2c5f2d',
                color: '#fff',
                padding: '0.55rem 1.1rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: !uploadFile || uploading ? 'not-allowed' : 'pointer',
                opacity: !uploadFile || uploading ? 0.6 : 1,
              }}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {uploadMsg && (
            <p
              style={{
                margin: 0,
                color: uploadMsg.startsWith('✅') ? '#2c5f2d' : '#b00',
              }}
            >
              {uploadMsg}
            </p>
          )}
        </div>
      )}

      {/* ---------- Cabin list ---------- */}
      {loading ? (
        <p>Loading…</p>
      ) : cabins.length === 0 ? (
        <p style={{ color: '#777' }}>No units yet. Create one above to get started.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {cabins.map(c => (
            <div
              key={c.id}
              style={{
                background: '#fff',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {c.primary_image ? (
                  <img
                    src={c.primary_image}
                    alt={c.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '6px',
                      background: '#eee',
                    }}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>{c.name}</strong>
                    <span style={badgeStyle(c.unit_type)}>
                      {c.unit_type === 'container' ? 'Container' : 'Capsule'}
                    </span>
                    {!c.is_active && (
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>(inactive)</span>
                    )}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    ${c.price_per_night}/night · sleeps {c.max_guests} · {c.bedrooms} bed · {c.bathrooms} bath
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => startEdit(c)}
                  style={{
                    padding: '0.45rem 1rem',
                    border: '1px solid #2c5f2d',
                    color: '#2c5f2d',
                    background: '#fff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(c.id)}
                  style={{
                    padding: '0.45rem 1rem',
                    border: '1px solid #b00',
                    color: '#b00',
                    background: '#fff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}