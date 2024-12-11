import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Base URL for the API
    headers: { 'Content-Type': 'application/json' },
});

export const login = async (credentials) => {
    // Send { userName, password } to the backend
    const response = await API.post('/api/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
};

export const register = async (userData) => {
    const response = await API.post('/api/accounts', userData);
    return response.data;
};
