import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchTopicDetails, fetchPosts } from '../api/posts';
import { fetchUserNameById } from '../api/users';
import Header from '../components/Header';
import { getUserIdFromToken, getUserRolesFromToken } from '../api/auth';

const TopicDetailsPage = () => {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
   
    const navigate = useNavigate();
    const userRoles = getUserRolesFromToken(); // Extract roles from the token
    const isAdmin = userRoles.includes('Admin');

    useEffect(() => {
        const loadData = async () => {
            try {
                const topicData = await fetchTopicDetails(topicId);

                // If the API response says the topic doesn't exist, display the message and stop further execution
                if (!topicData) {
                    setError('There is no such topic.');
                    return;
                }

                setTopic(topicData);

                const postData = await fetchPosts(topicId);
                setPosts(postData);

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

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleCreatePost = () => {
        navigate(`/topics/${topicId}/create-post`);
    };


    const handleUpdateTopic = () => {
        const currentUserId = getUserIdFromToken(); // Get the logged-in user's userId


        if (topic.userId === currentUserId || isAdmin) {
            navigate(`/topics/${topicId}/update`);
        } else {
            alert('You are not allowed to update this topic.');
        }
    };

    if (!isLoaded) {
        return <p>Loading topic details...</p>;
    }

    if (error === 'There is no such topic.') {
        return <p>There is no such topic.</p>;
    }

    return (
        <div>
            <Header />
            <header>
                <button onClick={handleBack}>Back</button>

                <button onClick={handleCreatePost} style={{ backgroundColor: 'lightblue', marginLeft: '10px' }}>
                    Create Post
                </button>
                <button onClick={handleUpdateTopic} style={{ backgroundColor: 'orange', marginLeft: '10px' }}>
                    Update Topic
                </button>
            </header>


            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <h2>Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h3  style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => navigate(`/topics/${topicId}/posts/${post.id}`)}
                            >{post.title}</h3>
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
        </div>
    );
};

export default TopicDetailsPage;
