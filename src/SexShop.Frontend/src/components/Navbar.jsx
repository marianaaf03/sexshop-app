import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/authService';

const Navbar = ({ cartCount, user, onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchTerm}`);
    };

    const roles = user?.roles || user?.Roles || [];
    const isAdmin = roles.some(role => role.toLowerCase() === 'admin');

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top py-3">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to={isAdmin ? "/admin" : "/"}>
                    <span className="logo-text">Olove</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    <form className="d-flex mx-auto col-lg-6 col-12 my-2 my-lg-0" onSubmit={handleSearch}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border-0 bg-light"
                                placeholder="Busca placer y elegancia..."
                                style={{ borderRadius: '25px 0 0 25px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-light border-0 px-3" type="submit" style={{ borderRadius: '0 25px 25px 0' }}>
                                <i className="bi bi-search text-accent"></i>
                            </button>
                        </div>
                    </form>

                    <ul className="navbar-nav align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item me-3">
                                    <span className="text-muted small">Hola, <span className="fw-bold text-accent">{user.nombre}</span></span>
                                </li>
                                {isAdmin && (
                                    <li className="nav-item me-3">
                                        <Link className="btn btn-sm btn-accent fw-bold rounded-pill px-3" to="/admin">
                                            <i className="bi bi-speedometer2 me-1"></i> Panel Admin
                                        </Link>
                                    </li>
                                )}

                                {/* Hide cart for Admin */}
                                {!isAdmin && (
                                    <li className="nav-item me-3">
                                        <Link className="nav-link p-0 text-dark fs-4 position-relative" to="/cart">
                                            <i className="bi bi-bag"></i>
                                            {cartCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent" style={{ fontSize: '0.6rem' }}>
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <button className="btn nav-link p-0 text-dark fs-4" onClick={onLogout} title="Cerrar Sesión">
                                        <i className="bi bi-box-arrow-right"></i>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item me-3">
                                    <Link className="nav-link p-0 text-dark fs-4" to="/login">
                                        <i className="bi bi-person"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link p-0 text-dark fs-4" to="/cart">
                                        <i className="bi bi-bag"></i>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
