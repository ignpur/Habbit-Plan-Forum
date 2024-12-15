import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTopicDetails, updateTopic } from '../api/topics';
import Header from '../components/Header';
import { deleteTopic } from '../api/topics';

const TopicUpdatePage = () => {
    const { topicId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [setDeleteError] = useState('');
    const navigate = useNavigate();

    // Load existing topic details
    useEffect(() => {
        const loadTopicDetails = async () => {
            try {
                const topicData = await fetchTopicDetails(topicId);
                setTitle(topicData.title);
                setDescription(topicData.description);
            } catch (err) {
                console.error('Failed to fetch topic details:', err);
                setError('Failed to load topic details.');
            }
        };

        loadTopicDetails();
    }, [topicId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTopic(topicId, { title, description }); // API call
            alert('Topic updated successfully!');
            navigate(`/topics/${topicId}`); // Redirect back to TopicDetailsPage
        } catch (err) {
            console.error('Failed to update topic:', err);
            setError('Failed to update the topic.');
        }
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

    return (
        <div>
        <Header/>
            <h1>Update Topic</h1>
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
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Update Topic</button>
                <button type="button" onClick={() => navigate(`/topics/${topicId}`)}>
                    Cancel
                </button>
            </form>
            <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteTopic}>
                Delete Topic
            </button>
        </div>
    );
};

export default TopicUpdatePage;
