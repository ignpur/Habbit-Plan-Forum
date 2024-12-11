import { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [topics, setTopics] = useState([]);

    // Function to fetch all topics from /api/topics
    const fetchTopics = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/topics'); // Use /api/topics route
            setTopics(response.data);
        } catch (err) {
            console.error('Error fetching topics', err);
        }
    };

    // Load topics on component mount
    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div>
            <h1>All Topics</h1>
            {topics.length > 0 ? (
                <ul>
                    {topics.map((topic) => (
                        <li key={topic.id}>
                            <h2>{topic.title}</h2>
                            <p>{topic.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No topics available</p>
            )}
        </div>
    );
};

export default DashboardPage;
