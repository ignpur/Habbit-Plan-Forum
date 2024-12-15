import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById } from '../api/posts';
import { fetchComments } from '../api/comments';
import { fetchUserNameById } from '../api/users';
import { getUserIdFromToken, getUserRolesFromToken } from '../api/auth'; // Import getUserRolesFromToken
import Header from '../components/Header';

const PostDetailsPage = () => {
    const { topicId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const currentUserId = getUserIdFromToken(); // Get the current logged-in user's ID
    const userRoles = getUserRolesFromToken(); // Extract roles from the token
    const isAdmin = userRoles.includes('Admin'); // Check if the user has the Admin role

    useEffect(() => {
        const loadPostAndComments = async () => {
            try {
                const postData = await fetchPostById(topicId, postId);
                setPost(postData);
                const userNameData = await fetchUserNameById(postData.userId);
                setUserName(userNameData);
                const commentData = await fetchComments(topicId, postId);
                setComments(commentData);
                const uniqueUserIds = [...new Set(commentData.map(comment => comment.userId))];
                const userFetchPromises = uniqueUserIds.map(async (userId) => {
                    try {
                        const userName = await fetchUserNameById(userId);
                        return { userId, userName };
                    } catch (err) {
                        console.error(`Failed to fetch username for userId: ${userId}`, err);
                        return { userId, userName: 'Unknown User' };
                    }
                });

                const users = await Promise.all(userFetchPromises);
                const usernameMap = {};
                users.forEach(user => {
                    usernameMap[user.userId] = user.userName;
                });
                setUsernames(usernameMap);

            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };

        loadPostAndComments();
    }, [topicId, postId]);

    const handleUpdatePost = () => {
        if (post.userId === currentUserId || isAdmin) {
            navigate(`/topics/${topicId}/posts/${postId}/update`);
        } else {
            alert('You are not allowed to update this topic.');
        }
    };

    const handleAddComment = () => {
        navigate(`/topics/${topicId}/posts/${postId}/create-comment`);
    };

    const handleUpdateComment = (commentId) => {
        navigate(`/topics/${topicId}/posts/${postId}/comments/${commentId}/update`);
    };

    const handleBack = () => {
        navigate(`/topics/${topicId}`);
    };

    if (!post) {
        return <p>Loading post details...</p>;
    }

    return (
        <div>
            <Header />
            <header>
                <button onClick={handleBack}>Back</button>
            </header>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>Created by: {userName || 'Loading...'}</p>

            <button onClick={handleAddComment} style={{ backgroundColor: 'lightblue' }}>
                Add Comment
            </button>
            <button onClick={handleUpdatePost} style={{ backgroundColor: 'orange', marginLeft: '10px' }}>
                Update Post
            </button>

            <h2>Comments</h2>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p>{comment.content}</p>
                            <p>
                                Posted by: {usernames[comment.userId] || 'Loading...'} at{' '}
                                {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            {(comment.userId === currentUserId || isAdmin) && (
                                <button
                                    onClick={() => handleUpdateComment(comment.id)}
                                    style={{
                                        backgroundColor: 'orange',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginLeft: '10px'
                                    }}
                                >
                                    Update
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments available.</p>
            )}
        </div>
    );
};

export default PostDetailsPage;
