import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById } from '../api/posts';
import { fetchComments } from '../api/comments';
import { fetchUserNameById } from '../api/users';
import Header from '../components/Header';

const PostDetailsPage = () => {
    const { topicId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [userName, setUserName] = useState('');
    const [setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadPostAndComments = async () => {
            try {
                // Fetch post details
                const postData = await fetchPostById(topicId, postId);
                setPost(postData);

                // Fetch post creator's username
                const userNameData = await fetchUserNameById(postData.userId);
                setUserName(userNameData);

                // Fetch comments
                const commentData = await fetchComments(topicId, postId);
                setComments(commentData);

                // Fetch usernames for comments
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
                setError('Failed to load post details or comments.');
            }
        };

        loadPostAndComments();
    }, [topicId, postId]);

    if (!post) {
        return <p>Loading post details...</p>;
    }

    return (
        <div>
            <Header />
            <header>
                <button onClick={() => navigate(-1)}>Back</button>
            </header>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>Created by: {userName || 'Loading...'}</p>

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

