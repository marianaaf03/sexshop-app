import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import orderService from '../api/orderService';

const Checkout = ({ cart, clearCart }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        zip: '',
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 150000 ? 0 : 15000;
    const total = subtotal + shipping;

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                totalAmount: total,
                details: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            const response = await orderService.create(orderData);

            if (response.success) {
                toast.success("¡Pago procesado con éxito!");
                clearCart();
                navigate('/order-success');
            } else {
                toast.error(response.message || "Error al procesar el pedido");
            }
        } catch (error) {
            console.error("Checkout error", error);
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-lg-7">
                    <motion.div
                        className="card card-premium p-4 p-lg-5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="fw-bold mb-4">Información de Envío y Pago</h2>
                        <form onSubmit={handleSubmit}>
                            <h5 className="mb-3 fw-bold text-accent">Dirección de Entrega</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Dirección Completa</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Ciudad</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        required
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Código Postal</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        required
                                        value={formData.zip}
                                        onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                    />
                                </div>
                            </div>

                            <h5 className="mb-3 fw-bold text-accent">Detalle de Pago</h5>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Nombre en la Tarjeta</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        required
                                        value={formData.cardName}
                                        onChange={e => setFormData({ ...formData, cardName: e.target.value })}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Número de Tarjeta</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-credit-card"></i></span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0"
                                            placeholder="0000 0000 0000 0000"
                                            required
                                            maxLength="16"
                                            value={formData.cardNumber}
                                            onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Vencimiento (MM/AA)</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        placeholder="MM/AA"
                                        required
                                        value={formData.expiry}
                                        onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">CVV</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light border-0"
                                        placeholder="***"
                                        required
                                        maxLength="3"
                                        value={formData.cvv}
                                        onChange={e => setFormData({ ...formData, cvv: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-accent w-100 py-3 fw-bold mt-5 rounded-pill shadow-sm"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</>
                                ) : `Pagar $${total.toLocaleString()}`}
                            </button>
                        </form>
                    </motion.div>
                </div>

                <div className="col-lg-5">
                    <div className="card card-premium p-4 border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
                        <h4 className="fw-bold mb-4">Tu Pedido</h4>
                        <div className="mb-4 overflow-auto" style={{ maxHeight: '300px' }}>
                            {cart.map(item => (
                                <div key={item.id} className="d-flex align-items-center mb-3">
                                    <img src={item.imageUrl || '/placeholder-product.jpg'} className="rounded shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} alt="" />
                                    <div className="ms-3 flex-grow-1">
                                        <div className="fw-bold small">{item.name}</div>
                                        <div className="text-muted small">Cant: {item.quantity}</div>
                                    </div>
                                    <div className="fw-bold small">${(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="text-muted">Envío</span>
                            <span>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-0 pt-2 border-top">
                            <span className="fw-bold fs-5">Total a Pagar</span>
                            <span className="fw-bold fs-5 text-accent">${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
