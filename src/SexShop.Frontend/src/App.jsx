import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/Admin/Dashboard';
import authService from './api/authService';

function App() {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        // Only allow adding to cart if NOT admin
        if (authService.isAdmin()) {
            toast.error("Los administradores no pueden realizar compras.");
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => String(item.id) === String(product.id));
            if (existing) {
                return prev.map(item =>
                    String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        toast.success(`${product.name} añadido al carrito`, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (String(item.id) === String(id)) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => String(item.id) !== String(id)));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Router>
            <Toaster position="top-right" />
            <div className="d-flex flex-column min-vh-100">
                <Navbar cartCount={cartCount} />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home addToCart={addToCart} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={
                            <Cart
                                cart={cart}
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                            />
                        } />
                        <Route path="/checkout" element={
                            <Checkout cart={cart} clearCart={clearCart} />
                        } />
                        <Route path="/order-success" element={<OrderSuccess />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                authService.isAdmin() ? <AdminDashboard /> : <Navigate to="/login" />
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
