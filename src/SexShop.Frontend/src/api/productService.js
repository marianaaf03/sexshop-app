import apiClient from './apiClient';

// Simple in-memory cache for products
let productCache = {
    active: null,
    admin: null,
    lastFetchActive: 0,
    lastFetchAdmin: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const productService = {
    getAll: async (page = 1, pageSize = 100, forceRefresh = false) => {
        const now = Date.now();
        if (!forceRefresh && productCache.active && (now - productCache.lastFetchActive < CACHE_DURATION)) {
            return productCache.active;
        }

        const response = await apiClient.get(`/api/product?page=${page}&pageSize=${pageSize}`);
        productCache.active = response.data;
        productCache.lastFetchActive = now;
        return response.data;
    },

    getAllAdmin: async (page = 1, pageSize = 50, forceRefresh = false) => {
        const now = Date.now();
        if (!forceRefresh && productCache.admin && (now - productCache.lastFetchAdmin < CACHE_DURATION)) {
            return productCache.admin;
        }

        const response = await apiClient.get(`/api/product/admin?page=${page}&pageSize=${pageSize}`);
        productCache.admin = response.data;
        productCache.lastFetchAdmin = now;
        return response.data;
    },

    clearCache: () => {
        productCache.active = null;
        productCache.admin = null;
        productCache.lastFetchActive = 0;
        productCache.lastFetchAdmin = 0;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/api/product/${id}`);
        return response.data;
    },

    create: async (productData) => {
        const response = await apiClient.post('/api/product', productData);
        productService.clearCache(); // Invalidate cache on change
        return response.data;
    },

    update: async (id, productData) => {
        const response = await apiClient.put(`/api/product/${id}`, productData);
        productService.clearCache(); // Invalidate cache on change
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/product/${id}`);
        productService.clearCache(); // Invalidate cache on change
        return response.data;
    }
};

export default productService;
