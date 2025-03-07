import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchNotifications, fetchUnreadCount } from '../slice';
import NotificationModal from './NotificationModal';

const NotificationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  const { unreadCount, isLoading } = useAppSelector(state => ({
    unreadCount: state.notifications?.unreadCount || 0,
    isLoading: state.notifications?.isLoading || false
  }));
  const isLoggedIn = useAppSelector(state => !!state.auth.userId);

  // Fetch notifications periodically
  useEffect(() => {
    if (isLoggedIn) {
      // Initial fetch
      dispatch(fetchUnreadCount());
      
      // Set up polling every 30 seconds
      const intervalId = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      
      // Clean up on unmount
      return () => clearInterval(intervalId);
    }
  }, [dispatch, isLoggedIn]);

  const toggleModal = () => {
    if (!isModalOpen && isLoggedIn) {
      // Fetch full notifications when opening the modal
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
    }
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-50 flex items-center justify-center"
        aria-label="Notifications"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {isLoading ? (
          <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            <div className="animate-spin h-3 w-3 border-t-2 border-b-2 border-white rounded-full"></div>
          </span>
        ) : unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default NotificationButton; 