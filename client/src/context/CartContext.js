import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, shipping: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], subtotal: 0, shipping: 0, total: 0 }); return; }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data);
    } catch (e) { console.error('Cart fetch error', e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (product_id, quantity = 1) => {
    await cartAPI.add({ product_id, quantity });
    await fetchCart();
  }, [fetchCart]);

  const updateQty = useCallback(async (cartItemId, quantity) => {
    await cartAPI.update(cartItemId, quantity);
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (cartItemId) => {
    await cartAPI.remove(cartItemId);
    await fetchCart();
  }, [fetchCart]);

  const count = cart.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQty, removeItem, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
