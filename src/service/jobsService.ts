import axiosInstance from ".";

const fetchJobs = async () => {
    try {
        const response = await axiosInstance.get('/api/jobs');
        if (!response) {
            throw new Error('Network response was not ok');
        }
        const data = response;
        return { success: true, data: data?.data };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Login failed, please try again.';
        throw new Error(errorMessage);
    }
};


export default {
    fetchJobs
}