import axios from 'axios';

const API_Base_URL = 'https://chatbot-backend-1-phyu.onrender.com';

const api = axios.create({
  baseURL: API_Base_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchComplaints = async () => {
  try {
    const response = await api.get('/api/complaints');
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const fetchProperties = async () => {
  try {
    const response = await api.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const updateComplaintStatus = async (complaintId, status) => {
  try {
    const response = await api.patch(`/api/complaints/${complaintId}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw error;
  }
};

export default api;
