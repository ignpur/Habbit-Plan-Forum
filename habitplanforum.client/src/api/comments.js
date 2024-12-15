import API from './auth';
import { getToken } from './auth';

export const fetchComments = async (topicId, postId) => {
    try {
        const response = await API.get(`/Topics/${topicId}/Posts/${postId}/Comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const createComment = async (topicId, postId, commentData) => {
    try {
        const token = getToken(); // Retrieve access token
        const response = await API.post(`/Topics/${topicId}/Posts/${postId}/Comments`,
            commentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
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
export const fetchCommentById = async (topicId, postId, commentId) => {
    try {
        const token = getToken();
        console.log('Token:', token); // Log the token for debugging

        if (!token) {
            throw new Error('Token is missing or expired. Please log in again.');
        }

        const response = await API.get(`/Topics/${topicId}/Posts/${postId}/Comments/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token for authentication
                },
                withCredentials: true, // Include cookies if required
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching comment:', error);
        throw error;
    }
};

export const updateComment = async (topicId, postId, commentId, commentData) => {
    try {
        const token = getToken(); // Retrieve access token
        const response = await API.put(`/Topics/${topicId}/Posts/${postId}/Comments/${commentId}`, commentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token for authentication
                },
            }
        );
        return response.data; // Return the updated comment data
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

export const deleteComment = async (topicId, postId, commentId) => {
    try {
        const token = getToken();
        console.log('Token:', token); // Log token for debugging

        if (!token) {
            throw new Error('Token is missing or expired. Please log in again.');
        }

        const response = await API.delete(`/Topics/${topicId}/Posts/${postId}/Comments/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token for authentication
                },
                withCredentials: true, // Include cookies if required
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};