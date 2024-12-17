import { Link } from 'react-router-dom';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import buttonStyles from '../styles/buttonStyles';

const HomePage = () => {
    const isAuthenticated = useAuth(); // Check if user is authenticated

    return (
        <div>
            <Header />
            <h1>Welcome to Saulius Smyrda Forum</h1>
            <p>This is the homepage where users can login and register</p>

            {isAuthenticated ? (
                <Link to="/dashboard" style={buttonStyles.primary}>Dashboard</Link>
            ) : (
                <>
                    <Link to="/register" style={buttonStyles.primary}>Register</Link>
                    <Link to="/login" style={buttonStyles.primary}>Login</Link>
                </>
            )}
        </div>
    );
};

export default HomePage;
