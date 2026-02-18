import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../api/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden.");
        }

        setLoading(true);
        setError('');
        try {
            const res = await authService.register(formData);
            if (res.success) {
                navigate('/login');
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Error al registrar el usuario.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <motion.div
                    className="col-md-6 col-lg-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="card card-premium p-4 p-lg-5">
                        <h2 className="text-center fw-bold mb-4">Crea tu cuenta</h2>
                        <p className="text-muted text-center mb-4">Únete a la experiencia Olove</p>

                        {error && <div className="alert alert-danger mb-4">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small fw-bold">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-3"
                                        required
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small fw-bold">Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-3"
                                        required
                                        value={formData.apellido}
                                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email</label>
                                <input
                                    type="email"
                                    className="form-control bg-light border-0 py-3"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0 py-3"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0 py-3"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <button
                                className="btn btn-accent w-100 py-3 fw-bold"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Registrarme Now'}
                            </button>
                        </form>

                        <div className="text-center mt-4 text-muted small">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-accent fw-bold text-decoration-none">Inicia sesión</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
