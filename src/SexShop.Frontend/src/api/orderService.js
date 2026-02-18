import apiClient from './apiClient';

const orderService = {
    create: async (orderData) => {
        const response = await apiClient.post('/api/order', orderData);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await apiClient.get('/api/order/my-orders');
        return response.data;
    }
};

export default orderService;
