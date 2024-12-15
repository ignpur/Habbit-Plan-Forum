import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTopic } from '../api/topics'; // Import the function to create a topic

const TopicCreatePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newTopic = { title, description };
            await createTopic(newTopic);
            navigate('/dashboard'); // Navigate back to Dashboard
        } catch (err) {
            setError('Failed to create topic. Please try again.', err);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h1>Create a New Topic</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Create Topic</button>
                <button onClick={handleBack}>Back</button>
            </form>
        </div>
    );
};

export default TopicCreatePage;
