import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { logout } from '../api/auth';
import buttonStyles from '../styles/buttonStyles'; // Import button styles

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <div style={styles.leftLinks}>
                    <Link to="/" style={styles.link}>Home</Link>
                    <Link to="/dashboard" style={styles.link}>View all topics</Link>
                </div>

                <div style={styles.rightButtons}>
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
    }
};

export default Header;
