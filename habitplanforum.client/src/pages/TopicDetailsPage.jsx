import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchTopicDetails, fetchPosts } from '../api/posts';
import { deleteTopic } from '../api/topics'; // ✅ Import delete method
import { logout } from '../api/auth'; // ✅ Logout logic

const TopicDetailsPage = () => {
    const { topicId } = useParams(); // ✅ Use topicId for deletion
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [deleteError, setDeleteError] = useState(''); // ✅ Error message for delete
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

    const handleDeleteTopic = async () => {
        try {
            await deleteTopic(topicId); // ✅ Delete the topic using topicId
            alert('Topic successfully deleted');
            navigate('/dashboard'); // ✅ Redirect to dashboard
        } catch (error) {
            console.error('Failed to delete topic', error);
            setDeleteError(error.message); // ✅ Set the error message
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

                {/* ✅ New delete button next to back and logout */}
                <button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={handleDeleteTopic}
                >
                    Delete Topic
                </button>
            </header>

            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>} {/* ✅ Display delete error */}

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
