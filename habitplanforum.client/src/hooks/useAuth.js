import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../api/auth'; // Assume this function checks if the user is logged in

const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get current route path
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if user is authenticated

    useEffect(() => {
        const checkAuthStatus = () => {
            const loggedIn = isLoggedIn(); // Check if the user is logged in

            if (!loggedIn) {
                const allowedPaths = ['/login', '/register', '/'];

                if (!allowedPaths.includes(location.pathname)) {
                    console.warn('User is not authenticated. Redirecting to login...');
                    navigate('/login'); // Redirect to login if no valid token and not on an allowed page
                }
            } else {
                setIsAuthenticated(true); // User is authenticated
            }
        };

        checkAuthStatus();
    }, [navigate, location.pathname]);

    return isAuthenticated; // Return the authentication state
};

export default useAuth;
