import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TopicCreatePage from './pages/TopicCreatePage';
import TopicDetailsPage from './pages/TopicDetailsPage';
import TopicUpdatePage from './pages/TopicUpdatePage';
import PostCreatePage from './pages/PostCreatePage';
import PostDetailsPage from './pages/PostDetailsPage';
import PostUpdatePage from './pages/PostUpdatePage';
import CommentCreatePage from './pages/CommentCreatePage';
import CommentUpdatePage from './pages/CommentUpdatePage';

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
                <Route path="/topics/:topicId/update" element={<TopicUpdatePage />} />
                <Route path="/topics/:topicId/create-post" element={<PostCreatePage />} />
                <Route path="/topics/:topicId/posts/:postId" element={<PostDetailsPage />} />
                <Route path="/topics/:topicId/posts/:postId/create-comment" element={<CommentCreatePage />} />
                <Route path="/topics/:topicId/posts/:postId/update" element={<PostUpdatePage />} />
                <Route path="/topics/:topicId/posts/:postId/comments/:commentId/update" element={<CommentUpdatePage />} />


            </Routes>
        </Router>
    );
}

export default App;
