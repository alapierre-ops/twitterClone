import React, { ReactNode } from 'react';
import NotificationButton from './NotificationButton';

interface NotificationsContainerProps {
  children: ReactNode;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({ children }) => {
  return (
    <>
      {children}
      <NotificationButton />
    </>
  );
};

export default NotificationsContainer; 