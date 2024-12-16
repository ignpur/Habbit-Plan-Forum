import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { logout, getUserIdFromToken } from '../api/auth';
import { fetchUserNameById } from '../api/users';
import buttonStyles from '../styles/buttonStyles';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAuth();
    const [userName, setUserName] = useState(null); // Store the username of the logged-in user

    useEffect(() => {
        const getUserName = async () => {
            if (isAuthenticated) {
                const userId = getUserIdFromToken();
                if (userId) {
                    console.log('UserID from token:', userId);
                    const fetchedUserName = await fetchUserNameById(userId);
                    setUserName(fetchedUserName);
                }
            }
        };

        getUserName();
    }, [isAuthenticated]); // Run this effect only when the auth state changes

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <div style={styles.leftLinks}>
                    <Link to="/" style={styles.link}>Home</Link>
                    <Link to="/dashboard" style={styles.link}>See all topic</Link>
                </div>

                <div style={styles.rightButtons}>
                    {isAuthenticated && userName && (
                        <span style={styles.userName}>Welcome, {userName}</span>
                    )}

                    {!isAuthenticated && (
                        <>
                            <button
                                style={buttonStyles.primary}
                                onClick={() => handleNavigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                style={buttonStyles.primary}
                                onClick={() => handleNavigate('/register')}
                            >
                                Register
                            </button>
                        </>
                    )}

                    {isAuthenticated && (
                        <button onClick={handleLogout} style={buttonStyles.danger}>
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '60px',
        backgroundColor: '#333',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'center'
    },
    leftLinks: {
        display: 'flex',
    },
    rightButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        margin: '0 20px',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    userName: {
        color: 'lightgreen',
        fontSize: '16px',
        marginRight: '20px',
        fontWeight: 'bold'
    }
};

export default Header;
