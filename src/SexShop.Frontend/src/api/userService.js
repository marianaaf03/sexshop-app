import apiClient from './apiClient';

const userService = {
    getAll: async () => {
        const response = await apiClient.get('/api/user');
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/user/${id}`);
        return response.data;
    }
};

export default userService;
