import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { adminAPI.getUsers().then(r => setUsers(r.data.users || [])).finally(() => setLoading(false)); }, []);

  const toggleStatus = async (id, status) => {
    const next = status === 'active' ? 'blocked' : 'active';
    try {
      await adminAPI.updateUserStatus(id, next);
      toast.success(`User ${next}`);
      setUsers(prev => prev.map(u => u._key === id ? { ...u, status: next } : u));
    } catch { toast.error('Failed'); }
  };

  const filtered = search ? users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) : users;

  return (
    <AdminLayout title="Users">
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="form-input" style={{ width: 280, padding: '8px 12px', fontSize: 13 }} />
        <span style={{ fontSize: 13, color: 'var(--light-gray)', marginLeft: 'auto' }}>{filtered.length} users</span>
      </div>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._key}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--warm-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--rose-dark)', flexShrink: 0 }}>{(u.username || 'U').charAt(0).toUpperCase()}</div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{u.username || '—'}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td style={{ fontSize: 12, color: 'var(--mid-gray)' }}>{u.mobile || '—'}</td>
                    <td><span className={`badge ${u.status === 'blocked' ? 'badge-red' : 'badge-green'}`}>{u.status || 'active'}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--light-gray)', whiteSpace: 'nowrap' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}</td>
                    <td>
                      <button onClick={() => toggleStatus(u._key, u.status || 'active')}
                        style={{ padding: '5px 12px', fontSize: 11, border: `1.5px solid ${u.status === 'blocked' ? '#86efac' : '#fecaca'}`, borderRadius: 'var(--r-full)', background: 'transparent', color: u.status === 'blocked' ? 'var(--green)' : 'var(--red)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background .1s' }}>
                        {u.status === 'blocked' ? 'Unblock' : 'Block'}
                      </button>
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
