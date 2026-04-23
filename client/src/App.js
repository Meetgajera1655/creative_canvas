import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import CreativeCanvas from './pages/CreativeCanvas';
import Kasab from './pages/Kasab';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminUsers from './pages/admin/AdminUsers';

function Protected({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: '70vh' }}>
        <Routes>
          {/* Public */}
          <Route path="/"                element={<Home />} />
          <Route path="/shop"            element={<Shop />} />
          <Route path="/creative-canvas" element={<CreativeCanvas />} />
          <Route path="/kasab"           element={<Kasab />} />
          <Route path="/product/:id"     element={<ProductDetails />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />

          {/* Protected User */}
          <Route path="/cart"          element={<Protected><Cart /></Protected>} />
          <Route path="/checkout"      element={<Protected><Checkout /></Protected>} />
          <Route path="/order-success" element={<Protected><OrderSuccess /></Protected>} />
          <Route path="/orders"        element={<Protected><Orders /></Protected>} />
          <Route path="/account"       element={<Protected><Account /></Protected>} />
          <Route path="/wishlist"      element={<Protected><Wishlist /></Protected>} />

          {/* Admin */}
          <Route path="/admin"          element={<Protected adminOnly><AdminDashboard /></Protected>} />
          <Route path="/admin/products" element={<Protected adminOnly><AdminProducts /></Protected>} />
          <Route path="/admin/orders"   element={<Protected adminOnly><AdminOrders /></Protected>} />
          <Route path="/admin/reviews"  element={<Protected adminOnly><AdminReviews /></Protected>} />
          <Route path="/admin/users"    element={<Protected adminOnly><AdminUsers /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '13px' },
          }}
        />
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}
