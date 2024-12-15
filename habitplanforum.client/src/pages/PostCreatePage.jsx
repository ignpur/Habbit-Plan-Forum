import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost } from '../api/posts';

const PostCreatePage = () => {
    const { topicId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPost = { title, content };
            await createPost(topicId, newPost); // API call
            navigate(`/topics/${topicId}`); // Redirect back to TopicDetailsPage
        } catch (err) {
            console.error('Failed to create post:', err);
            setError('Failed to create post. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create a Post</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Content:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Create Post</button>
                <button type="button" onClick={() => navigate(`/topics/${topicId}`)}>Cancel</button>
            </form>
        </div>
    );
};

export default PostCreatePage;
