import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCommentById, updateComment, deleteComment } from '../api/comments'; // Import deleteComment from comments.js
import Header from '../components/Header';

const CommentUpdatePage = () => {
    const { topicId, postId, commentId } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadCommentDetails = async () => {
            try {
                const commentData = await fetchCommentById(topicId, postId, commentId);
                setContent(commentData.content);
            } catch (err) {
                console.error('Failed to fetch comment details:', err);
                setError('Failed to load comment details.');
            }
        };

        loadCommentDetails();
    }, [topicId, postId, commentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateComment(topicId, postId, commentId, { content });
            alert('Comment updated successfully!');
            navigate(`/topics/${topicId}/posts/${postId}`); // Redirect to the post details page
        } catch (err) {
            console.error('Failed to update comment:', err);
            setError('Failed to update the comment.');
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment(topicId, postId, commentId); // Call deleteComment from comments.js
            alert('Comment successfully deleted');
            navigate(`/topics/${topicId}/posts/${postId}`); // Redirect to the Post Details page
        } catch (err) {
            console.error('Failed to delete comment:', err);
            alert('Failed to delete the comment.');
        }
    };

    return (
        <div>
            <Header />
            <h1>Update Comment</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Content:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button
                    type="submit"
                    style={{
                        backgroundColor: 'lightblue',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        marginTop: '20px'
                    }}
                >
                    Update Comment
                </button>
                <button
                    type="button"
                    onClick={() => navigate(`/topics/${topicId}/posts/${postId}`)}
                    style={{
                        backgroundColor: 'grey',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        marginLeft: '10px'
                    }}
                >
                    Cancel
                </button>
            </form>

            <button
                onClick={handleDeleteComment}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Delete Comment
            </button>
        </div>
    );
};

export default CommentUpdatePage;
