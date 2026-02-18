import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard';

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
                {/* Decorative element */}
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

            {/* Categories */}
            <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn rounded-pill px-4 ${category === cat ? 'btn-accent' : 'btn-outline-secondary'}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-accent" role="status"></div>
                </div>
            ) : (
                <div className="row g-4 px-2">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-3">
                            <ProductCard product={product} addToCart={!isAdmin ? addToCart : null} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
