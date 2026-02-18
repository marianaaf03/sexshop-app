import apiClient from './apiClient';

const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/api/auth/login', credentials);
        if (response.data.success) {
            const apiUser = response.data.data;
            localStorage.setItem('token', apiUser.token);
            localStorage.setItem('user', JSON.stringify({
                email: apiUser.email,
                nombre: apiUser.nombre,
                // Handle casing: some APIs return 'Roles', others 'roles'
                roles: apiUser.roles || apiUser.Roles || []
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
        if (!user) return false;
        const roles = user.roles || user.Roles || [];
        return roles.some(role => role.toLowerCase() === 'admin');
    }
};

export default authService;
