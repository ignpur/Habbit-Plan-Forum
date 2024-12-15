import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchTopicDetails, fetchPosts } from '../api/posts';
import { logout } from '../api/auth';

const TopicDetailsPage = () => {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const topicData = await fetchTopicDetails(topicId);
                if (topicData === null) {
                    setError('No posts available for this topic.');
                    setIsLoaded(true);
                    return;
                }
                setTopic(topicData);
            } catch (err) {
                console.error('Error fetching topic details', err);
                setError('Failed to load topic details.');
                setIsLoaded(true);
                return;
            }

            try {
                const postData = await fetchPosts(topicId);
                setPosts(postData);
            } catch (err) {
                console.error('Error fetching posts', err);
                setError('Failed to load posts.');
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, [topicId]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!isLoaded) {
        return <p>Loading topic details...</p>;
    }

    return (
        <div>
            <header>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleLogout}>Logout</button>
            </header>

            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    <h1>{topic.title}</h1>
                    <p>{topic.description}</p>

                    <h2>Posts</h2>
                    {posts.length > 0 ? (
                        <ul>
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No posts available for this topic</p>
                    )}
                </>
            )}
        </div>
    );
};

export default TopicDetailsPage;
