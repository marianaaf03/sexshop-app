import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    return (
        <div className="container py-5 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-5"
            >
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
                    <i className="bi bi-check-lg display-3"></i>
                </div>
                <h1 className="display-4 fw-bold mb-3">¡Orden Confirmada!</h1>
                <p className="fs-5 text-muted mb-5">Gracias por confiar en Olove. Tu pedido ha sido procesado con éxito y pronto llegará a tus manos con total discreción.</p>
                <div className="d-flex gap-3 justify-content-center">
                    <Link to="/" className="btn btn-accent btn-lg px-5 rounded-pill shadow-sm">Seguir comprando</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-lg px-5 rounded-pill">Mis pedidos</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
