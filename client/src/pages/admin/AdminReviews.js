import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI, reviewsAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { adminAPI.getReviews().then(r => setReviews(r.data.reviews || [])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await reviewsAPI.delete(id); toast.success('Deleted'); setReviews(prev => prev.filter(r => r._key !== id)); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout title="Reviews">
      <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500, color: 'var(--off-black)' }}>All Reviews</h3>
          <span style={{ fontSize: 13, color: 'var(--light-gray)' }}>{reviews.length} total</span>
        </div>
        {loading ? <div className="loading-center"><div className="spinner" /></div> :
          reviews.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--light-gray)', fontSize: 14 }}>No reviews yet</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Customer</th><th>Product</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr></thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r._key}>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{r.username || 'Customer'}</td>
                      <td style={{ fontSize: 12, color: 'var(--mid-gray)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product_name || r.product_id}</td>
                      <td>
                        <span style={{ background: r.rating >= 4 ? 'var(--green)' : r.rating >= 3 ? '#f59e0b' : 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-sm)' }}>★ {r.rating}</span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--mid-gray)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment || '—'}</td>
                      <td style={{ fontSize: 11, color: 'var(--light-gray)', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                      <td><button onClick={() => del(r._key)} style={{ padding: '5px 10px', fontSize: 11, border: '1.5px solid #fecaca', borderRadius: 'var(--r-full)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Delete</button></td>
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
