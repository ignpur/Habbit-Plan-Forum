import { useState, useEffect } from 'react';
import { fetchTopics } from '../api/topics';
import { fetchUserNameById } from '../api/users';
//import { logout } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';

const DashboardPage = () => {
    const [topics, setTopics] = useState([]);
    const [usernames, setUsernames] = useState({});
    const navigate = useNavigate();

    useAuth(); // Protect this page

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const data = await fetchTopics();
                setTopics(data);
                console.log('Fetched topics:', data);

                const uniqueUserIds = [...new Set(data.map(topic => topic.userId))];
                console.log('Unique UserIds:', uniqueUserIds);

                const userFetchPromises = uniqueUserIds.map(async (userId) => {
                    if (!usernames[userId]) {
                        try {
                            const userName = await fetchUserNameById(userId);
                            return { userId, userName };
                        } catch (err) {
                            console.error(`Failed to fetch UserName for ${userId}:`, err);
                            return { userId, userName: 'Unknown User' };
                        }
                    }
                });

                const users = await Promise.all(userFetchPromises);
                const newUsernames = { ...usernames };
                users.forEach(user => {
                    if (user) newUsernames[user.userId] = user.userName;
                });
                setUsernames(newUsernames);
            } catch (error) {
                console.error('Failed to load topics and usernames:', error);
            }
        };

        loadTopics();
    }, []);

    //const handleLogout = async () => {
    //    await logout();
    //    navigate('/login');
    //};

    const handleCreateNewTopic = () => {
        navigate('/create-topic'); // Navigate to the TopicCreatePage
    };

    return (
        <div>
            <Header />
            <h1>All Topics</h1>
            {/*<button onClick={handleLogout}>Logout</button>*/}

            {/* New "Create New Topic" button */}
            <button style={{ backgroundColor: 'lightblue' }} onClick={handleCreateNewTopic}>Create New Topic</button> 
            <ul>
                {topics.map(topic => (
                    <li key={topic.id}>
                        <h2>
                            <Link to={`/topics/${topic.id}`}>{topic.title}</Link> {/* Make title a clickable link */}
                        </h2>
                        <p>{topic.description}</p>
                        <p>Posted by: {usernames[topic.userId] || 'Loading...'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
