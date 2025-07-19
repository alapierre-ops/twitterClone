import axiosInstance from "../../api/axiosConfig.ts";
import { Notification, NotificationResponse } from "./types.ts";

export const getNotifications = async () => {
  const response = await axiosInstance.get<NotificationResponse>(`/notifications`);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get<{ count: number }>('/notifications/unread-count');
  return response.data.count;
};

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await axiosInstance.put<Notification>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.put<{ message: string }>('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`/notifications/${id}`);
  return response.data;
};
