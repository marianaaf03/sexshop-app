import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-top mt-5 py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4">
                        <h4 className="logo-text mb-3">Olove</h4>
                        <p className="text-muted">Tu boutique de confianza para explorar el placer con elegancia y discreción.</p>
                    </div>
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">Enlaces Rápidos</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-decoration-none text-muted">Inicio</a></li>
                            <li><a href="/cart" className="text-decoration-none text-muted">Mi Carrito</a></li>
                            <li><a href="/login" className="text-decoration-none text-muted">Cuenta</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <h5 className="fw-bold mb-3">Síguenos</h5>
                        <div className="d-flex justify-content-md-end gap-3 fs-4">
                            <i className="bi bi-instagram text-accent"></i>
                            <i className="bi bi-facebook text-accent"></i>
                            <i className="bi bi-whatsapp text-accent"></i>
                        </div>
                    </div>
                </div>
                <hr className="my-4 text-muted" />
                <div className="text-center text-muted small">
                    &copy; 2026 SexShop - <span className="text-accent fw-bold">Placer y Elegancia</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
