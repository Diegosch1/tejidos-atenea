import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, cantidad = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        const newQty = existing.cantidad + cantidad;
        if (newQty > product.stock) return prev;
        return prev.map(i =>
          i.product_id === product.id ? { ...i, cantidad: newQty } : i
        );
      }
      return [...prev, {
        product_id:     product.id,
        nombre:         product.nombre,
        precio:         Number(product.precio),
        imagen_path:    product.imagen_path,
        stock:          product.stock,
        cantidad,
      }];
    });
  }, []);

  const removeItem = useCallback((product_id) => {
    setItems(prev => prev.filter(i => i.product_id !== product_id));
  }, []);

  const updateQty = useCallback((product_id, cantidad) => {
    setItems(prev =>
      cantidad < 1
        ? prev.filter(i => i.product_id !== product_id)
        : prev.map(i => i.product_id === product_id ? { ...i, cantidad } : i)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total      = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};