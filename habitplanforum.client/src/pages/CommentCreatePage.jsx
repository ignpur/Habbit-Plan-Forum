import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createComment } from '../api/comments';
import Header from '../components/Header';

const CommentCreatePage = () => {
    const { topicId, postId } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newComment = { content };
            await createComment(topicId, postId, newComment); // Call the API to create the comment
            navigate(`/topics/${topicId}/posts/${postId}`); // Redirect back to the post details page
        } catch (err) {
            console.error('Failed to create comment:', err);
            setError('Failed to create comment. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(`/topics/${topicId}/posts/${postId}`); // Cancel and return to post details page
    };

    return (
        <div>
            <Header />
            <h1>Add a Comment</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Comment:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: '100%', height: '100px' }}
                    />
                </label>
                <br />
                <button type="submit" style={{ backgroundColor: 'lightgreen', padding: '10px 20px', borderRadius: '5px' }}>
                    Add Comment
                </button>
                <button type="button" onClick={handleCancel} style={{ backgroundColor: 'red', padding: '10px 20px', borderRadius: '5px', marginLeft: '10px' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CommentCreatePage;
