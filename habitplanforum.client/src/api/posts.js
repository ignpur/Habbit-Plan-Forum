import API from './auth';
import { getToken } from './auth';

// Function to fetch topic details by topicId
export const fetchTopicDetails = async (topicId) => {
    try {
        const response = await API.get(`/Topics/${topicId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn(`No posts found for topicId: ${topicId}`);
            return null;
        }
        console.error('Error fetching topic details', error);
        throw new Error('Failed to load topic details. Please try again later.');
    }
};

// Function to fetch all posts for a specific topic
export const fetchPosts = async (topicId) => {
    try {
        const response = await API.get(`/Topics/${topicId}/Posts`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn(`No posts found for topicId: ${topicId}`);
            return []; // Return an empty array instead of throwing an error
        }
        console.error('Error fetching posts', error);
        throw new Error('Failed to load posts.');
    }
};

export const createPost = async (topicId, postData) => {
    try {
        const token = getToken(); // Retrieve access token
        const response = await API.post(
            `/Topics/${topicId}/posts`,
            postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};


export const fetchPostById = async (topicId, postId) => {
    try {
        const response = await API.get(`/Topics/${topicId}/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};
