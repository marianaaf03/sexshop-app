import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, addToCart }) => {
    return (
        <motion.div
            className="card card-premium h-100 d-flex flex-column"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            <div className="position-relative">
                <img
                    src={product.imageUrl || '/placeholder-product.jpg'}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                    loading="lazy"
                />
                <span className="badge bg-white text-accent position-absolute top-0 end-0 m-3 shadow-sm rounded-pill">
                    {product.category}
                </span>
            </div>
            <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title fw-bold">{product.name}</h5>
                <p className="card-text text-muted small flex-grow-1">
                    {product.description?.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fs-4 fw-bold text-accent">${product.price?.toLocaleString()}</span>
                    {addToCart && (
                        <button
                            className="btn btn-accent px-3 py-2 shadow-sm rounded-pill"
                            onClick={() => addToCart(product)}
                        >
                            <i className="bi bi-cart-plus me-1"></i> Comprar
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
