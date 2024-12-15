import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TopicDetailsPage from './pages/TopicDetailsPage';
import TopicCreatePage from './pages/TopicCreatePage';
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/topics/:topicId" element={<TopicDetailsPage />} />
                <Route path="/create-topic" element={<TopicCreatePage />} /> 
            </Routes>
        </Router>
    );
}

export default App;
