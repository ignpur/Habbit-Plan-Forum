import API from './auth'; // Import the same axios instance from auth.js

export const fetchUserNameById = async (userId) => {
    try {
        console.log(`Fetching username for UserId: ${userId}`);

        const response = await API.get(`/accounts/${userId}`);

        const userName = response.data.userName;
        if (!userName) {
            console.warn(`UserName not found for UserId: ${userId}`);
            return 'Unknown User';
        }

        return userName;
    } catch (error) {
        console.error(`Failed to fetch UserName for UserId ${userId}:`, error);
        return 'Unknown User';
    }
};
