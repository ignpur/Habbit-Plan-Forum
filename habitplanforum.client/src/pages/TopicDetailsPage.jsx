import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TopicDetailsPage = () => {
    const { topicId } = useParams(); // Get topicId from URL
    const [topic, setTopic] = useState(null);

    const fetchTopicDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/topics/${topicId}`);
            setTopic(response.data);
        } catch (err) {
            console.error('Error fetching topic details', err);
        }
    };

    useEffect(() => {
        fetchTopicDetails();
    }, [topicId]);

    if (!topic) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <h2>Posts</h2>
            {topic.posts.length > 0 ? (
                <ul>
                    {topic.posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
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
