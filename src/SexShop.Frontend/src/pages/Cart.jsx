import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = ({ cart, updateQuantity, removeFromCart }) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 150000 ? 0 : 15000;
    const total = subtotal + shipping;

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-5 flex-grow-1">Mi Bolsa de Compras</h2>

            {cart.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-bag-x fs-1 text-muted mb-4 d-block"></i>
                    <p className="fs-4 text-muted">Tu bolsa está vacía.</p>
                    <Link to="/" className="btn btn-accent mt-3 px-5">Ir a la tienda</Link>
                </div>
            ) : (
                <div className="row g-5">
                    {/* Cart List */}
                    <div className="col-lg-8">
                        {cart.map(item => (
                            <motion.div
                                key={item.id}
                                className="card card-premium mb-3 border-0 shadow-sm"
                                layout
                            >
                                <div className="card-body d-flex align-items-center">
                                    <img
                                        src={item.imageUrl || '/placeholder-product.jpg'}
                                        alt={item.name}
                                        className="rounded"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <div className="ms-4 flex-grow-1">
                                        <h5 className="fw-bold mb-1">{item.name}</h5>
                                        <p className="text-muted small mb-0">{item.category}</p>
                                        <div className="d-flex align-items-center mt-2">
                                            <button className="btn btn-sm btn-light rounded-circle" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span className="mx-3 fw-bold">{item.quantity}</span>
                                            <button className="btn btn-sm btn-light rounded-circle" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <p className="fw-bold fs-5 mb-1">${(item.price * item.quantity).toLocaleString()}</p>
                                        <button className="btn btn-link text-danger p-0 small" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="col-lg-4">
                        <div className="card card-premium p-4 sticky-top" style={{ top: '100px' }}>
                            <h4 className="fw-bold mb-4">Resumen</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="text-muted">Envío</span>
                                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4 mt-2">
                                <span className="fw-bold fs-5">Total</span>
                                <span className="fw-bold fs-5 text-accent">${total.toLocaleString()}</span>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-accent w-100 py-3 fw-bold text-decoration-none text-center"
                            >
                                Proceder al Pago
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
