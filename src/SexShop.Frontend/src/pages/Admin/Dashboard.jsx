import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../api/productService';
import userService from '../../api/userService';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'users'

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Para Él',
        imageUrl: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        console.log("AdminDashboard: Starting data fetch...");
        try {
            // Use getAllAdmin to see ALL products including hidden ones
            const productData = await productService.getAllAdmin();
            console.log("AdminDashboard: Products received:", productData);
            setProducts(productData.data || []);

            const userData = await userService.getAll();
            console.log("AdminDashboard: Users received:", userData);
            setUsers(userData.data || []);
        } catch (error) {
            console.error("AdminDashboard: Error fetching admin data", error);
            // Fallback to normal getIfNeeded
            try {
                const productData = await productService.getAll();
                setProducts(productData.data || []);
            } catch (e) {
                toast.error("Error al cargar los datos del panel");
            }
        } finally {
            console.log("AdminDashboard: Fetch completed, disabling loading state.");
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                stock: product.stock,
                category: product.category,
                imageUrl: product.imageUrl || '',
                activo: product.activo ?? true // Default to true if undefined
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: 'Para Él',
                imageUrl: '',
                activo: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar datos para el backend (convertir strings a números)
        const productToSave = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        };

        try {
            if (editingProduct) {
                console.log(`Actualizando producto ${editingProduct.id}:`, productToSave);
                await productService.update(editingProduct.id, productToSave);
                toast.success("Producto actualizado con éxito");
            } else {
                console.log("Creando nuevo producto:", productToSave);
                await productService.create(productToSave);
                toast.success("Producto creado con éxito");
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error al guardar producto:", error.response?.data || error.message);
            const msg = error.response?.data?.message || "Error al conectar con el servidor";
            toast.error(`Error: ${msg}`);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await productService.delete(id);
                toast.success("Producto eliminado");
                fetchData();
            } catch (error) {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await userService.delete(id);
                toast.success("Usuario eliminado");
                fetchData();
            } catch (error) {
                toast.error("Error al eliminar");
            }
        }
    };

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-accent"></div></div>;

    const categories = ['Para Él', 'Para Ella', 'Vibradores', 'Cosméticos', 'Accesorios', 'Diversión'];

    return (
        <div className="container py-5 mt-4">
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="display-5 fw-bold m-0 text-primary">Control Center</h1>
                    <p className="text-muted mt-2 mb-0">Gestiona tus productos y usuarios desde un solo lugar.</p>
                </div>
                {activeTab === 'products' && (
                    <button className="btn btn-accent px-4 py-2 shadow-sm hover-lift" onClick={() => handleOpenModal()}>
                        <i className="bi bi-plus-circle me-2"></i> Nuevo Producto
                    </button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card card-premium p-4 border-0 shadow-sm bg-white">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="bi bi-box-seam text-primary fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase fw-bold">Productos</h6>
                                <h3 className="mb-0 fw-bold">{products.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card card-premium p-4 border-0 shadow-sm bg-white">
                        <div className="d-flex align-items-center">
                            <div className="bg-accent bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="bi bi-people text-accent fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase fw-bold">Usuarios</h6>
                                <h3 className="mb-0 fw-bold">{users.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card card-premium p-4 border-0 shadow-sm bg-white">
                        <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="bi bi-star text-warning fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase fw-bold">Categorías</h6>
                                <h3 className="mb-0 fw-bold">{categories.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card card-premium p-4 border-0 shadow-sm bg-white">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="bi bi-graph-up-arrow text-success fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase fw-bold">Soporte</h6>
                                <h3 className="mb-0 fw-bold">Active</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="d-flex gap-3 mb-4">
                <button
                    className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'products' ? 'btn-accent shadow-sm' : 'btn-light text-muted'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Productos
                </button>
                <button
                    className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'users' ? 'btn-accent shadow-sm' : 'btn-light text-muted'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Usuarios
                </button>
            </div>

            <div className="card card-premium border-0 shadow-lg overflow-hidden glass">
                {activeTab === 'products' ? (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Detalle del Producto</th>
                                    <th className="py-3">Categoría</th>
                                    <th className="py-3 text-center">Precio</th>
                                    <th className="py-3 text-center">Stock</th>
                                    <th className="text-end px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={product.imageUrl || '/placeholder-product.jpg'}
                                                    alt=""
                                                    className="rounded-circle me-3 border shadow-sm"
                                                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <div className="fw-bold text-main text-truncate" style={{ maxWidth: '200px' }}>
                                                        {product.name}
                                                        {!product.activo && <span className="badge bg-danger ms-2">Inactivo</span>}
                                                    </div>
                                                    <div className="text-muted x-small">ID: #{product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className="badge rounded-pill bg-light text-primary border px-3 py-2">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center fw-bold text-accent">${product.price?.toLocaleString()}</td>
                                        <td className="py-3 text-center">
                                            <span className={`fw-bold ${product.stock < 10 ? 'text-danger' : 'text-success'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="text-end px-4 py-3">
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-sm btn-light text-primary hover-lift me-2"
                                                    title="Editar"
                                                    onClick={() => handleOpenModal(product)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light text-danger hover-lift"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    title="Eliminar"
                                                >
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Usuario</th>
                                    <th className="py-3">Correo Electrónico</th>
                                    <th className="py-3 text-center">Fecha de Registro</th>
                                    <th className="text-end px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-accent bg-opacity-10 text-accent rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                                    <i className="bi bi-person-fill"></i>
                                                </div>
                                                <span className="fw-bold text-main">{user.nombre} {user.apellido}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-muted">{user.email}</td>
                                        <td className="py-3 text-center text-muted">
                                            {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="text-end px-4 py-3">
                                            <button className="btn btn-sm btn-outline-danger px-3 rounded-pill hover-lift" onClick={() => handleDeleteUser(user.id)}>
                                                <i className="bi bi-person-x me-1"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit */}
            < AnimatePresence >
                {showModal && (
                    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', zIndex: 1050
                    }}>
                        <motion.div
                            className="bg-white rounded-4 shadow-lg p-4 p-lg-5 w-100"
                            style={{ maxWidth: '600px' }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold m-0">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Nombre del Producto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Precio</label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Stock</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Categoría</label>
                                        <select
                                            className="form-select"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">URL de la Imagen</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 mt-5">
                                    <button type="button" className="btn btn-light w-100 py-3 fw-bold" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-accent w-100 py-3 fw-bold">Guardar Cambios</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default AdminDashboard;
