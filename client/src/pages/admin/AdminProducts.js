import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productsAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { getImageUrl, formatPrice } from '../../utils/image';

const RESIN_CATS  = ['Earrings','Tray','Pooja Thali','Frame','Mobile Cover','Coaster','Show Piece','Night Lamp','Custom Order'];
const KASAB_CATS  = ['Khatali','Dupatta','Blouse','Saree Work','Embroidered Cushion','Wall Hanging','Table Runner','Dress Material','Custom Order'];
const EMPTY = { name: '', type: '', brand: 'resin', price: '', stock: '0', description: '', photo: null };

export default function AdminProducts() {
  const [sp] = useSearchParams();
  const [tab, setTab]         = useState(sp.get('brand') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState('');

  const fetch = async () => {
    setLoading(true);
    const r = await productsAPI.getAll(tab ? { brand: tab, sort: 'newest' } : { sort: 'newest' });
    setProducts(r.data.products || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [tab]);

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k !== 'photo' && v !== null && v !== undefined) fd.append(k, v); });
      if (form.photo) fd.append('photo', form.photo);
      if (editId) { await productsAPI.update(editId, fd); toast.success('Product updated!'); }
      else         { await productsAPI.create(fd); toast.success('Product added!'); }
      setForm(EMPTY); setEditId(null); fetch();
    } catch (e) { toast.error(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try { await productsAPI.delete(id); toast.success('Product deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  const startEdit = p => {
    setForm({ name: p.name||'', type: p.type||'', brand: p.brand||'resin', price: p.price||'', stock: p.stock||'0', description: p.description||'', photo: null });
    setEditId(p._key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cats = form.brand === 'kasab' ? KASAB_CATS : RESIN_CATS;
  const filtered = search ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())) : products;

  return (
    <AdminLayout title="Products">
      {/* Add/Edit Form */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 28, marginBottom: 24, boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--off-black)', marginBottom: 22 }}>
          {editId ? '✏️ Edit Product' : '+ Add New Product'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group"><label className="form-label">Product Name *</label><input className="form-input" value={form.name} onChange={e => up('name', e.target.value)} placeholder="e.g. Floral Resin Tray" /></div>
          <div className="form-group">
            <label className="form-label">Brand *</label>
            <select className="form-input" value={form.brand} onChange={e => { up('brand', e.target.value); up('type', ''); }}>
              <option value="resin">🎨 Creative Canvas (Resin)</option>
              <option value="kasab">🧵 Kasab (Embroidery)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.type} onChange={e => up('type', e.target.value)}>
              <option value="">Select category…</option>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Price (₹) *</label><input className="form-input" type="number" min="1" value={form.price} onChange={e => up('price', e.target.value)} placeholder="999" /></div>
          <div className="form-group"><label className="form-label">Stock (0 = unlimited)</label><input className="form-input" type="number" min="0" value={form.stock} onChange={e => up('stock', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Product Photo</label><input className="form-input" type="file" accept="image/*" onChange={e => up('photo', e.target.files[0])} style={{ padding: '8px 12px' }} /></div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => up('description', e.target.value)} placeholder="Describe this product…" /></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={save} disabled={saving} className="btn btn-rose">{saving ? 'Saving…' : editId ? 'Update Product' : 'Add Product'}</button>
          {editId && <button onClick={() => { setForm(EMPTY); setEditId(null); }} className="btn btn-outline">Cancel</button>}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {[['', 'All'], ['resin', '🎨 Resin'], ['kasab', '🧵 Kasab']].map(([b, l]) => (
          <button key={b} onClick={() => setTab(b)}
            style={{ padding: '7px 16px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${tab === b ? 'var(--off-black)' : 'var(--border-light)'}`, background: tab === b ? 'var(--off-black)' : 'var(--white)', color: tab === b ? 'var(--white)' : 'var(--mid-gray)', transition: 'all .15s', fontFamily: 'var(--font-body)' }}>
            {l}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…" className="form-input" style={{ marginLeft: 'auto', width: 200, padding: '7px 12px', fontSize: 13 }} />
        <span style={{ fontSize: 13, color: 'var(--light-gray)' }}>{filtered.length} products</span>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._key}>
                    <td>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--warm-100)', overflow: 'hidden' }}>
                        <img src={getImageUrl(p.photo, p.name)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/FAE8DB/C9897A?text=A'; }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--off-black)', maxWidth: 180 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </td>
                    <td><span className={`badge ${p.brand === 'kasab' ? 'badge-gold' : 'badge-rose'}`}>{p.brand === 'kasab' ? 'Kasab' : 'Resin'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--mid-gray)' }}>{p.type || '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--rose)' }}>{formatPrice(p.price)}</td>
                    <td style={{ fontSize: 12, color: p.stock > 0 ? 'var(--green)' : 'var(--light-gray)', fontWeight: p.stock > 0 ? 600 : 400 }}>{p.stock > 0 ? `${p.stock} left` : '∞'}</td>
                    <td>
                      {Number(p.rating_avg) > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ background: 'var(--green)', color: 'var(--white)', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--r-sm)' }}>★ {p.rating_avg}</span>
                          <span style={{ fontSize: 11, color: 'var(--light-gray)' }}>({p.review_count})</span>
                        </div>
                      ) : <span style={{ fontSize: 11, color: 'var(--light-gray)' }}>No reviews</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => startEdit(p)} className="btn btn-ghost btn-sm" style={{ fontSize: 12, border: '1px solid var(--border-light)' }}>Edit</button>
                        <button onClick={() => del(p._key)} style={{ padding: '6px 12px', fontSize: 12, border: '1.5px solid #fecaca', borderRadius: 'var(--r-full)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background .1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--red-light)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
