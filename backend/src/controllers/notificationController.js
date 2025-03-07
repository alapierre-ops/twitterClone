import Notification from '../models/notifications.js';
import User from '../models/users.js';

const formatNotification = async (notification) => {
  const sender = await User.findById(notification.sender).select('username profilePicture');
  
  let message = '';
  switch (notification.type) {
    case 'like':
      message = 'liked your post';
      break;
    case 'comment':
      message = 'commented on your post';
      break;
    case 'follow':
      message = 'started following you';
      break;
    case 'repost':
      message = 'reposted your post';
      break;
    default:
      message = 'interacted with your content';
  }

  return {
    id: notification._id,
    type: notification.type,
    message,
    timestamp: notification.createdAt,
    read: notification.read,
    userId: sender._id,
    username: sender.username,
    profilePicture: sender.profilePicture,
    postId: notification.post,
    commentId: notification.comment
  };
};

export const createNotification = async (data) => {
  try {
    if (data.sender.toString() === data.recipient.toString()) {
      return null;
    }
    
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedNotifications = await Promise.all(
      notifications.map(notification => formatNotification(notification))
    );

    const unreadCount = await Notification.countDocuments({ 
      recipient: userId,
      read: false
    });

    res.status(200).json({
      notifications: formattedNotifications,
      unreadCount,
      page,
      hasMore: notifications.length === limit
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const formattedNotification = await formatNotification(notification);
    res.status(200).json(formattedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      recipient: userId,
      read: false
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 