import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/image';

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items = [], subtotal = 0, shipping = 0, total = 0 } = cart;
  const [addr, setAddr] = useState({ name: user?.username || '', email: user?.email || '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [method, setMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (addr.pincode && addr.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${addr.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success') {
            const po = data[0].PostOffice[0];
            setAddr(a => ({ ...a, city: po.District, state: po.State }));
            toast.success('City & State auto-filled from PIN Code!', { icon: '📍', style: { borderRadius: '10px', background: '#111', color: '#fff', fontSize: '13px' } });
          }
        })
        .catch(() => {});
    }
  }, [addr.pincode]);

  const up = (k, v) => setAddr(a => ({ ...a, [k]: v }));

  const placeOrder = async () => {
    const req = ['name', 'email', 'phone', 'line1', 'city', 'state', 'pincode'];
    for (const f of req) { if (!addr[f]?.trim()) { toast.error(`Please fill: ${f}`); return; } }
    if (!items.length) { toast.error('Cart is empty'); return; }

    setLoading(true);
    const orderItems = items.map(i => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity || 1 }));

    try {
      if (method === 'razorpay') {
        const loaded = await loadRazorpay();
        if (!loaded) { toast.error('Payment gateway unavailable. Please use COD.'); setLoading(false); return; }
        const rz = await ordersAPI.createRazorpay({ amount: Math.round(total * 100) });
        const { order_id, amount, currency, key } = rz.data;
        new window.Razorpay({
          key, amount, currency, order_id,
          name: 'Creative Canvas', description: 'Handcrafted Art',
          prefill: { name: addr.name, email: addr.email, contact: addr.phone },
          theme: { color: '#c9897a' },
          handler: async r => {
            try {
              await ordersAPI.verifyPayment({ razorpay_order_id: r.razorpay_order_id, razorpay_payment_id: r.razorpay_payment_id, razorpay_signature: r.razorpay_signature });
              const o = await ordersAPI.create({ items: orderItems, address: addr, payment_method: 'Razorpay', payment_id: r.razorpay_payment_id, total, shipping });
              toast.success('Payment successful! Order placed.'); await fetchCart();
              navigate('/order-success', { state: { orderId: o.data.order_id } });
            } catch { toast.error('Payment verification failed. Contact support.'); }
          },
          modal: { ondismiss: () => setLoading(false) },
        }).open();
      } else {
        const o = await ordersAPI.create({ items: orderItems, address: addr, payment_method: 'COD', total, shipping });
        toast.success('Order placed!'); await fetchCart();
        navigate('/order-success', { state: { orderId: o.data.order_id } }); setLoading(false);
      }
    } catch (e) { toast.error(e.response?.data?.error || 'Something went wrong'); setLoading(false); }
  };

  if (!items.length) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 16 }}>Your cart is empty</h2>
      <Link to="/shop" className="btn btn-primary">Shop Now</Link>
    </div>
  );

  const renderField = (label, k, type = 'text', ph, span2 = false, listId = '') => (
    <div className="form-group" style={span2 ? { gridColumn: 'span 2' } : {}} key={k}>
      <label className="form-label">{label} *</label>
      <input className="form-input" type={type} value={addr[k]} onChange={e => up(k, e.target.value)} placeholder={ph} list={listId ? listId : undefined} />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 72 }}>
      <div className="breadcrumb" style={{ marginBottom: 20 }}><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><Link to="/cart">Cart</Link><span className="breadcrumb-sep">›</span><span>Checkout</span></div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 32 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
        <div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 28, marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--off-black)', marginBottom: 22 }}>Delivery Address</h3>
            
            <datalist id="statesList">
              <option value="Andhra Pradesh" /><option value="Arunachal Pradesh" /><option value="Assam" /><option value="Bihar" /><option value="Chhattisgarh" /><option value="Goa" /><option value="Gujarat" /><option value="Haryana" /><option value="Himachal Pradesh" /><option value="Jharkhand" /><option value="Karnataka" /><option value="Kerala" /><option value="Madhya Pradesh" /><option value="Maharashtra" /><option value="Manipur" /><option value="Meghalaya" /><option value="Mizoram" /><option value="Nagaland" /><option value="Odisha" /><option value="Punjab" /><option value="Rajasthan" /><option value="Sikkim" /><option value="Tamil Nadu" /><option value="Telangana" /><option value="Tripura" /><option value="Uttar Pradesh" /><option value="Uttarakhand" /><option value="West Bengal" />
              <option value="Andaman and Nicobar Islands" /><option value="Chandigarh" /><option value="Dadra and Nagar Haveli and Daman and Diu" /><option value="Delhi" /><option value="Jammu and Kashmir" /><option value="Ladakh" /><option value="Lakshadweep" /><option value="Puducherry" />
            </datalist>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {renderField("Full Name", "name", "text", "Your name")}
              {renderField("Email", "email", "email", "email@example.com")}
              {renderField("Phone", "phone", "text", "+91 98765 43210", true)}
              {renderField("Address Line 1", "line1", "text", "House/Flat No, Street", true)}
              {renderField("Address Line 2 (optional)", "line2", "text", "Area, Landmark", true)}
              {renderField("PIN Code", "pincode", "text", "400001")}
              {renderField("City", "city", "text", "City")}
              {renderField("State", "state", "text", "State", true, "statesList")}
            </div>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--off-black)', marginBottom: 18 }}>Payment Method</h3>
            {[['razorpay', '💳', 'Razorpay', 'Cards, UPI, NetBanking & Wallets'], ['cod', '📦', 'Cash on Delivery', 'Pay when your order arrives']].map(([val, icon, name, desc]) => (
              <label key={val} onClick={() => setMethod(val)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: `1.5px solid ${method === val ? 'var(--off-black)' : 'var(--border-light)'}`, borderRadius: 'var(--r-lg)', marginBottom: 10, cursor: 'pointer', background: method === val ? 'var(--warm-50)' : 'var(--white)', transition: 'all .15s' }}>
                <input type="radio" checked={method === val} onChange={() => setMethod(val)} style={{ accentColor: 'var(--rose)', width: 16, height: 16 }} />
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--off-black)' }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--light-gray)', marginTop: 1 }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 24, position: 'sticky', top: 'calc(var(--nav-h) + 12px)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--off-black)', marginBottom: 18 }}>Order Summary</h3>
          {items.map(i => (
            <div key={i._key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: 13 }}>
              <span style={{ color: 'var(--mid-gray)', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name} ×{i.quantity || 1}</span>
              <span style={{ fontWeight: 500 }}>{formatPrice((i.price || 0) * (i.quantity || 1))}</span>
            </div>
          ))}
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}><span style={{ color: 'var(--mid-gray)' }}>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: 14 }}>
            <span style={{ color: 'var(--mid-gray)' }}>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--green)' : 'inherit', fontWeight: shipping === 0 ? 600 : 400 }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border-light)', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--off-black)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{formatPrice(total)}</span>
          </div>
          <button onClick={placeOrder} disabled={loading} className="btn btn-rose btn-full btn-lg" style={{ justifyContent: 'center' }}>
            {loading ? 'Processing…' : method === 'razorpay' ? `Pay ${formatPrice(total)}` : 'Place Order'}
          </button>
          <p style={{ fontSize: 11, color: 'var(--light-gray)', textAlign: 'center', marginTop: 10 }}>🔒 SSL secured · Powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
}
