import apiClient from './apiClient';

const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/api/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify({
                email: response.data.data.email,
                nombre: response.data.data.nombre,
                roles: response.data.data.roles
            }));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/api/auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        if (!user || !user.roles) return false;
        return user.roles.some(role => role.toLowerCase() === 'admin');
    }
};

export default authService;
