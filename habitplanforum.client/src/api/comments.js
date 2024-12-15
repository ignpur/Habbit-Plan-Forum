import API from './auth';

export const fetchComments = async (topicId, postId) => {
    try {
        const response = await API.get(`/Topics/${topicId}/Posts/${postId}/Comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};
