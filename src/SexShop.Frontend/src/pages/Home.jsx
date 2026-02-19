import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard';

const ProductSkeleton = () => (
    <div className="col-12 col-md-6 col-lg-3">
        <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="skeleton" style={{ height: '250px' }}></div>
            <div className="card-body">
                <div className="skeleton mb-2" style={{ height: '20px', width: '80%' }}></div>
                <div className="skeleton mb-3" style={{ height: '15px', width: '60%' }}></div>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="skeleton" style={{ height: '30px', width: '40%' }}></div>
                    <div className="skeleton" style={{ height: '40px', width: '40%', borderRadius: '20px' }}></div>
                </div>
            </div>
        </div>
    </div>
);

const Home = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        if (authService.isAdmin()) {
            navigate('/admin');
            return;
        }

        const fetchProducts = async () => {
            try {
                // Use default params but benefit from internal caching in productService
                const data = await productService.getAll();
                setProducts(data.data || []);
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || p.category === category;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Para Él', 'Para Ella', 'Vibradores', 'Cosméticos', 'Accesorios', 'Diversión'];

    const isAdmin = authService.isAdmin();

    return (
        <div className="container py-5">
            {/* Banner */}
            <motion.div
                className="home-banner mb-5 text-white shadow-lg overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                    borderRadius: '30px',
                    padding: '80px 40px',
                    position: 'relative'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="col-lg-7">
                        <motion.h1
                            className="display-2 fw-bold mb-4"
                            initial={{ x: -50 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Placer sin Límites
                        </motion.h1>
                        <p className="fs-4 mb-5 opacity-90 fw-light">Explora nuestra colección premium diseñada para elevar tus experiencias íntimas.</p>
                        <button className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow-sm hover-lift">
                            Ver Novedades
                        </button>
                    </div>
                </div>
                <div
                    className="position-absolute"
                    style={{
                        bottom: '-10%',
                        right: '-5%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        zIndex: 1
                    }}
                />
            </motion.div>

            {/* Filter and Categories */}
            <div className="row mb-5 align-items-center">
                <div className="col-12">
                    <div className="d-flex justify-content-center flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`btn rounded-pill px-4 btn-sm ${category === cat ? 'btn-accent' : 'btn-outline-secondary'}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="row g-4 px-2">
                {loading ? (
                    Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-3">
                            <ProductCard product={product} addToCart={!isAdmin ? addToCart : null} />
                        </div>
                    ))
                )}
                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-search display-1 text-muted opacity-25"></i>
                        <p className="fs-4 mt-3 text-muted">No encontramos productos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
