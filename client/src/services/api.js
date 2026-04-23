import axios from 'axios';

/* ===========================
   ✅ BASE URL (IMPORTANT)
=========================== */

// Use Render backend in production, localhost in dev
const BASE_URL =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:5000/api';

/* ===========================
   ✅ AXIOS INSTANCE
=========================== */

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000
});

/* ===========================
   🔐 REQUEST INTERCEPTOR
=========================== */

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===========================
   ⚠️ RESPONSE INTERCEPTOR
=========================== */

api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ===========================
   📦 API MODULES
=========================== */

export const authAPI = {
  login: data => api.post('/auth/login', data),
  signup: data => api.post('/auth/signup', data),
  me: () => api.get('/auth/me'),
};

export const productsAPI = {
  getAll: params => api.get('/products', { params }),
  getOne: id => api.get(`/products/${id}`),
  getCategories: params => api.get('/products/categories', { params }),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: id => api.delete(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: data => api.post('/cart', data),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: id => api.delete(`/cart/${id}`),
};

export const ordersAPI = {
  create: data => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getOne: id => api.get(`/orders/${id}`),
  createRazorpay: data => api.post('/orders/create-razorpay-order', data),
  verifyPayment: data => api.post('/orders/verify-payment', data),
  getAllAdmin: () => api.get('/orders/admin/all'),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const reviewsAPI = {
  getForProduct: pid => api.get(`/reviews/${pid}`),
  submit: data => api.post('/reviews', data),
  delete: id => api.delete(`/reviews/${id}`),
};

export const searchAPI = {
  search: q => api.get('/search', { params: { q } }),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id, status) =>
    api.put(`/admin/users/${id}/status`, { status }),
  getReviews: () => api.get('/admin/reviews'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: product_id => api.post('/wishlist/toggle', { product_id }),
  check: pid => api.get(`/wishlist/check/${pid}`),
};

export default api;