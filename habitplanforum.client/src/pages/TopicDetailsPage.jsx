import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchTopicDetails, fetchPosts } from '../api/posts';
import { fetchUserNameById } from '../api/users';
import { deleteTopic } from '../api/topics';
import { logout } from '../api/auth';

const TopicDetailsPage = () => {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const topicData = await fetchTopicDetails(topicId);
                setTopic(topicData);

                const postData = await fetchPosts(topicId); // Handles 404 gracefully
                setPosts(postData);

                // Fetch usernames for post creators
                const uniqueUserIds = [...new Set(postData.map(post => post.userId))];
                const userFetchPromises = uniqueUserIds.map(async (userId) => {
                    try {
                        const userName = await fetchUserNameById(userId);
                        return { userId, userName };
                    } catch (err) {
                        console.error(`Failed to fetch UserName for ${userId}:`, err);
                        return { userId, userName: 'Unknown User' };
                    }
                });

                const users = await Promise.all(userFetchPromises);
                const newUsernames = {};
                users.forEach(user => {
                    if (user) newUsernames[user.userId] = user.userName;
                });
                setUsernames(newUsernames);

            } catch (err) {
                console.error('Error fetching topic details:', err);
                setError('Failed to load topic details.');
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
        navigate('/dashboard');
    };

    const handleCreatePost = () => {
        navigate(`/topics/${topicId}/create-post`); // Navigate to PostCreatePage
    };

    const handleDeleteTopic = async () => {
        try {
            await deleteTopic(topicId);
            alert('Topic successfully deleted');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete topic', error);
            setDeleteError(error.message);
        }
    };

    if (!isLoaded) {
        return <p>Loading topic details...</p>;
    }

    return (
        <div>
            <header>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleLogout}>Logout</button>
                <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteTopic}>
                    Delete Topic
                </button>
                <button onClick={handleCreatePost} style={{ backgroundColor: 'lightblue', marginLeft: '10px' }}>
                    Create Post
                </button>
            </header>

            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}

                    <h2>Posts</h2>
                    {topic ? (
                        <ul>
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <p>
                                        Posted by: {usernames[post.userId] || 'Loading...'}
                                    </p>
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
