import { useState } from 'react';
import { register } from '../api/auth';
import Header from '../components/Header';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState(''); // Added username field
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ email, password, userName }); // Send all 3 fields
            setSuccess(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Header />
            <h1>Register</h1>
            {success ? <p>Registration successful! You can now login.</p> : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
            )}
        </div>
    );
};

export default RegisterPage;
