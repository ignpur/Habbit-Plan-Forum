import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Attach the access token to every request if available
API.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split('.')[1])); // Decode JWT payload
        const expirationTime = payload.exp * 1000; // JWT expiration time is in seconds, so convert to ms
        if (Date.now() > expirationTime) {
            try {
                console.log('Access token expired. Refreshing...');
                const response = await API.post('/api/accessToken', {}, { withCredentials: true });
                accessToken = response.data.accessToken;
                localStorage.setItem('accessToken', accessToken);
            } catch (error) {
                console.error('Failed to refresh access token:', error);
                localStorage.removeItem('accessToken');
            }
        }
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

export const login = async (credentials) => {
    try {
        const response = await API.post('/api/login', credentials);
        localStorage.setItem('accessToken', response.data.accessToken); // Store access token
        return response.data.user;
    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Re-throw so the UI can show an error message
    }
};

export const logout = async () => {
    try {
        await API.post('/api/logout', {}, { withCredentials: true });
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Failed to logout:', error);
    }
};

export const register = async (userData) => {
    try {
        const response = await API.post('/api/accounts', userData);
        return response.data;
    } catch (error) {
        console.error('Failed to register:', error);
        throw error;
    }
};

export const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return false;

    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1])); // Decode JWT payload
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < expirationTime;
    } catch (error) {
        console.error('Error parsing access token:', error);
        return false;
    }
};

export default API;
