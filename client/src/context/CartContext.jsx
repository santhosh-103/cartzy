import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('amazonCart');
    return saved ? JSON.parse(saved) : [];
  });
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('amazonCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const quantity = Number(qty);
    const existingIndex = cartItems.findIndex((item) => item.product === product._id);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].qty + quantity;
      const maxStock = product.countInStock || updated[existingIndex].countInStock || 10;

      if (newQty > maxStock) {
        addToast(`Maximum available stock reached (${maxStock})`, 'error');
        updated[existingIndex].qty = maxStock;
      } else {
        updated[existingIndex].qty = newQty;
        addToast(`Updated ${product.name} quantity to ${newQty}`, 'success');
      }
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          countInStock: product.countInStock,
          brand: product.brand,
          isPrime: product.isPrime,
          qty: quantity,
        },
      ]);
      addToast(`Added "${product.name.slice(0, 30)}..." to your Cart`, 'success');
    }
  };

  const updateQuantity = (productId, qty) => {
    const quantity = Number(qty);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const maxStock = item.countInStock || 10;
          const finalQty = Math.min(quantity, maxStock);
          return { ...item, qty: finalQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((i) => i.product === productId);
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.name.slice(0, 25)}..." from Cart`, 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('amazonCart');
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0
  );
  const totalSavings = Math.max(0, originalTotal - itemsPrice);
  const shippingPrice = itemsPrice >= 499 || itemsCount === 0 ? 0 : 40;
  const taxPrice = 0; // Inclusive of all taxes on Amazon India
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        originalTotal,
        totalSavings,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
