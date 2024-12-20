import axios from 'axios';

const API = axios.create({
    baseURL: 'https://squid-app-f6hpu.ondigitalocean.app/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

let isRefreshing = false;
let subscribers = [];

export const getToken = () => {
    return localStorage.getItem('accessToken');
};

export const setToken = (token) => {
    localStorage.setItem('accessToken', token);
};

export const clearToken = () => {
    localStorage.removeItem('accessToken');
};

const onTokenRefreshed = (newToken) => {
    subscribers.forEach(callback => callback(newToken));
    subscribers = [];
};

const addSubscriber = (callback) => {
    subscribers.push(callback);
};

export const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token payload
        return payload.name || payload.sub; // Return the username, or fallback to the "sub" (user ID) if name is not available
    } catch (error) {
        console.error('Failed to parse JWT token', error);
        return null;
    }
};

export const getUserRolesFromToken = () => {
    const token = getToken();
    if (!token) return [];

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload

        // Extract roles from the JWT
        const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            || payload['role']
            || [];

        // Ensure roles are always an array
        return Array.isArray(roles) ? roles : [roles];
    } catch (error) {
        console.error('Failed to parse JWT token', error);
        return [];
    }
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
        await API.post('/logout', null, { withCredentials: true }); // Sends cookies
        localStorage.clear();
        sessionStorage.clear();

        // Delete any non-HttpOnly cookies (browser-side fallback)
        document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/;`;
        });
        window.location.href = '/';
    } catch (error) {
        console.error('Failed to logout:', error);
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
