import API from './auth'; // Import the same axios instance from auth.js
import { getToken, refreshAccessToken } from './auth';

export const fetchTopics = async () => {
    try {
        const response = await API.get('/Topics');
        return response.data;
    } catch (err) {
        console.error('Error fetching topics', err);
        throw err;
    }
};

export const createTopic = async (topic) => {
    try {
        const token = getToken();
        const response = await API.post('/topics', topic, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refreshAccessToken();
                const response = await API.post('/topics', topic, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`
                    }
                });
                return response.data;
            } catch (err) {
                throw new Error('Failed to refresh token and retry request.', err);
            }
        } else {
            throw error;
        }
    }
};


export const deleteTopic = async (topicId) => {
    try {
        const token = getToken();
        await API.delete(`/topics/${topicId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refreshAccessToken();
                await API.delete(`/topics/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`
                    }
                });
            } catch (refreshError) {
                if (refreshError.response && (refreshError.response.status === 403 || refreshError.response.status === 401)) {
                    throw new Error('You cannot delete this post.');
                }
                throw new Error('Failed to refresh token and retry delete request.');
            }
        } else if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            throw new Error('You cannot delete this post.');
        } else {
            throw error;
        }
    }
};

export const updateTopic = async (topicId, updatedData) => {
    try {
        const response = await API.put(`/topics/${topicId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating topic:', error);
        throw error;
    }
};

export const fetchTopicDetails = async (topicId) => {
    try {
        const response = await API.get(`/topics/${topicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topic details:', error);
        throw error;
    }
};