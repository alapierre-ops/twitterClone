import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationState } from './types.ts';
import * as notificationService from './service.ts';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    try {
      return await notificationService.getNotifications();
    } catch (error: any) {
      return (error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async () => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error: any) {
      return (error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (error: any) {
      return (error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error: any) {
      return (error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const removeNotification = createAsyncThunk(
  'notifications/removeNotification',
  async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error: any) {
      return (error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })      
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
        console.log("You have", state.unreadCount, "unread notifications")
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload;
        state.notifications = state.notifications.map(notification => 
          notification.id === updatedNotification.id ? updatedNotification : notification
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          read: true
        }));
        state.unreadCount = 0;
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const removedNotification = state.notifications.find(n => n.id === notificationId);
        state.notifications = state.notifications.filter(notification => notification.id !== notificationId);
        
        if (removedNotification && !removedNotification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const { resetNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
