import apiClient from './apiClient';

const productService = {
    getAll: async () => {
        const response = await apiClient.get('/api/product');
        return response.data;
    },

    getAllAdmin: async () => {
        const response = await apiClient.get('/api/product/admin');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/api/product/${id}`);
        return response.data;
    },

    create: async (productData) => {
        const response = await apiClient.post('/api/product', productData);
        return response.data;
    },

    update: async (id, productData) => {
        const response = await apiClient.put(`/api/product/${id}`, productData);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/product/${id}`);
        return response.data;
    }
};

export default productService;
