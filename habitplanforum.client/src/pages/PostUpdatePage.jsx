import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost, deletePost } from '../api/posts'; // Import deletePost from posts.js
import Header from '../components/Header';

const PostUpdatePage = () => {
    const { topicId, postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadPostDetails = async () => {
            try {
                const postData = await fetchPostById(topicId, postId);
                setTitle(postData.title);
                setContent(postData.content);
            } catch (err) {
                console.error('Failed to fetch post details:', err);
                setError('Failed to load post details.');
            }
        };

        loadPostDetails();
    }, [topicId, postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePost(topicId, postId, { title, content });
            alert('Post updated successfully!');
            navigate(`/topics/${topicId}/posts/${postId}`); // Redirect to the post details page
        } catch (err) {
            console.error('Failed to update post:', err);
            setError('Failed to update the post.');
        }
    };

    const handleDeletePost = async () => {
        try {
            await deletePost(topicId, postId); // Call deletePost from posts.js
            alert('Post successfully deleted');
            navigate(`/topics/${topicId}`); // Redirect to the Topic Details page
        } catch (err) {
            console.error('Failed to delete post:', err);
            alert('Failed to delete the post.');
        }
    };

    return (
        <div>
            <Header />
            <h1>Update Post</h1>
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
                <button type="submit" style={{ backgroundColor: 'lightblue', padding: '10px 20px', borderRadius: '5px' }}>
                    Update Post
                </button>
                <button
                    type="button"
                    onClick={() => navigate(`/topics/${topicId}/posts/${postId}`)}
                    style={{ backgroundColor: 'grey', padding: '10px 20px', borderRadius: '5px', marginLeft: '10px' }}
                >
                    Cancel
                </button>
            </form>

            <button
                onClick={handleDeletePost}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Delete Post
            </button>
        </div>
    );
};

export default PostUpdatePage;
