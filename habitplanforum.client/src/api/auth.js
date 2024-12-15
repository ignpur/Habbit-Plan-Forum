import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
const ACCESS_TOKEN_KEY = 'accessToken';

let isRefreshing = false;
let subscribers = [];

export const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const onTokenRefreshed = (newToken) => {
    subscribers.forEach(callback => callback(newToken));
    subscribers = [];
};

const addSubscriber = (callback) => {
    subscribers.push(callback);
};

export const refreshAccessToken = async () => {
    if (isRefreshing) {
        // If a token is already being refreshed, return a Promise that resolves when the token is ready
        return new Promise((resolve) => {
            subscribers.push(resolve);
        });
    }

    isRefreshing = true;

    try {
        const response = await API.post('/accessToken', {}, { withCredentials: true });
        const newToken = response.data.accessToken;

        // Store the new token
        localStorage.setItem('accessToken', newToken);
        onTokenRefreshed(newToken); // Notify all subscribers
        return newToken; // Return new token to allow chaining
    } catch (error) {
        console.error('Token refresh failed', error);

        // If refresh fails with 422 (Unprocessable Entity), log out
        if (error.response && error.response.status === 422) {
            logout(); // Call logout to clear everything
        }

        // Reject all queued promises since the refresh failed
        subscribers.forEach(callback => callback(null));
        subscribers = [];
        throw error;
    } finally {
        isRefreshing = false;
    }
};
// Attach the access token to every request if available
axios.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) refreshAccessToken();

            return new Promise((resolve) => {
                addSubscriber((newToken) => {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(axios(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);



export const logout = async () => {
    try {
        await API.post('/logout', {}, { withCredentials: true });
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = '/login';
    } catch (error) {
        console.error('Failed to logout', error);
    }
};


// Login API
export const login = async (credentials) => {
    try {
        const response = await API.post('/login', credentials);
        localStorage.setItem('accessToken', response.data.accessToken); // Store access token
        return response.data.user;
    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Re-throw so the UI can show an error message
    }
};

export const register = async (userData) => {
    try {
        const response = await API.post('/accounts', userData);
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