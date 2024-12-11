//import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to Habit Plan Sharing Forum</h1>
            <p>This is the homepage where users can login, register, or browse the forum.</p>

            <Link to="/login">Login</Link> |
            <Link to="/register">Register</Link> |
            <Link to="/dashboard">Dashboard</Link>
        </div>
    );
};

export default HomePage;
