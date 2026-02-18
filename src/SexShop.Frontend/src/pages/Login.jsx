import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../api/authService';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (authService.isAdmin()) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authService.login(credentials);
            if (res.success) {
                window.dispatchEvent(new Event('storage')); // Notify navbar
                navigate('/');
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    if (authService.isAdmin()) {
        return (
            <div className="container py-5 text-center mt-5">
                <div className="spinner-border text-accent mb-3"></div>
                <h3>Ya estás identificado como Administrador</h3>
                <p className="text-muted">Redirigiéndote a tu panel...</p>
                <Link to="/admin" className="btn btn-accent px-5 py-2 mt-3 rounded-pill">Ir al Panel de Control Ahora</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <motion.div
                    className="col-md-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="card card-premium p-4 p-lg-5">
                        <h2 className="text-center fw-bold mb-4">Bienvenida de nuevo</h2>
                        <p className="text-muted text-center mb-4">Ingresa a tu cuenta Olove</p>

                        {error && <div className="alert alert-danger mb-4">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email</label>
                                <input
                                    type="email"
                                    className="form-control bg-light border-0 py-3"
                                    required
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0 py-3"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                            <button
                                className="btn btn-accent w-100 py-3 fw-bold"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Entrando...' : 'Iniciar Sesión'}
                            </button>
                        </form>

                        <div className="text-center mt-4 text-muted small">
                            ¿No tienes cuenta? <Link to="/register" className="text-accent fw-bold text-decoration-none">Regístrate aquí</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
