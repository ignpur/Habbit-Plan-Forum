import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../api/auth';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            console.warn('User is not authenticated. Redirecting to login...');
            navigate('/login');
        }
    }, [navigate]);
};

export default useAuth;
