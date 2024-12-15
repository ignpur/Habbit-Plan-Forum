import API from './auth'; // Import the same axios instance from auth.js

export const fetchTopics = async () => {
    try {
        const response = await API.get('/Topics');
        return response.data;
    } catch (err) {
        console.error('Error fetching topics', err);
        throw err;
    }
};

export const createTopic = async (topicData) => {
    try {
        const response = await API.post('/Topics', topicData);
        return response.data;
    } catch (err) {
        console.error('Error creating topic', err);
        throw err;
    }
};

export const deleteTopic = async (topicId) => {
    try {
        const response = await API.delete(`/api/topics/${topicId}`);
        return response.data;
    } catch (err) {
        console.error('Error deleting topic', err);
        throw err;
    }
};
