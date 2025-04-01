import axios from 'axios';
import {API_BASE_URL} from '../constants/api';

export const loginUser = async (user_name, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/login`, {
            user_name,
            password,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Login error', error);
        return null;
    }
}

export const register = async (user_name, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/register`, {
            user_name,
            password,
        });

        if (response.status === 201) {
            return user_name;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export const fetchComplaintDetails = async (complaintId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/complaints/${complaintId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching complaint details:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const uploadFiles = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/uploads/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading files:", error);
        throw error;
    }
};

export const updateResolutionDetails = async (resolutionData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/resolutions`, resolutionData);
        return response.data;
    } catch (error) {
        console.error("Error submitting resolution details:", error);
        throw error;
    }
};

// New functions to fetch pending complaints

export const fetchPendingComplaints = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/complaints/pending`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pending complaints:", error);
        throw error;
    }
};

export const fetchResolutionHistory = async (id) => {
    try {
        console.log("Fetching from:", `${API_BASE_URL}/resolutions_history/${id}`);

        const response = await axios.get(`${API_BASE_URL}/resolutions_history/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resolution History:", error);
        throw error;
    }
}