import axios from 'axios';
import { 
  GetNotificationsResponse, 
  MarkAsReadResponse, 
  MarkAllAsReadResponse,
  GetUnreadCountResponse,
  DeleteNotificationResponse
} from './types';

const API_URL = 'http://localhost:5000'; // Replace with your actual API URL

export const getNotifications = async (token: string, page: number = 1, limit: number = 20): Promise<GetNotificationsResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/notifications?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (token: string, id: string): Promise<MarkAsReadResponse> => {
  try {
    const response = await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllAsRead = async (token: string): Promise<MarkAllAsReadResponse> => {
  try {
    const response = await axios.put(`${API_URL}/api/notifications/read-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadCount = async (token: string): Promise<GetUnreadCountResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (token: string, id: string): Promise<DeleteNotificationResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/api/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 