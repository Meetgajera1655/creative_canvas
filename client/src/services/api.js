import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 20000 });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: d => api.post('/auth/login', d),
  signup: d => api.post('/auth/signup', d),
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
  updateStatus: (id, d) => api.put(`/orders/${id}/status`, d),
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
  updateUserStatus: (id, s) => api.put(`/admin/users/${id}/status`, { status: s }),
  getReviews: () => api.get('/admin/reviews'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: product_id => api.post('/wishlist/toggle', { product_id }),
  check: pid => api.get(`/wishlist/check/${pid}`),
};

export default api;
