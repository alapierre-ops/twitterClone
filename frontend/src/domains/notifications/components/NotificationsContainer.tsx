import React, { ReactNode } from 'react';
import NotificationButton from './NotificationButton';
import { NavigateFunction } from 'react-router-dom';

interface NotificationsContainerProps {
  children: ReactNode;
  navigate: NavigateFunction;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({ children, navigate }) => {
  return (
    <>
      {children}
      <NotificationButton navigate={navigate} />
    </>
  );
};

export default NotificationsContainer; 