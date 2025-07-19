import { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import routes from './app/routes';
import NotificationsContainer from './domains/notifications/components/NotificationsContainer';

export interface RouteItem {
  path: string;
  element: ReactElement;
}

function App() {
  return (
    <Router>
      <AppWithNotifications />
    </Router>
  );
}

function AppWithNotifications() {
  const navigate = useNavigate();

  return (
    <NotificationsContainer navigate={navigate}>
      <Routes>
        {routes.map((route: RouteItem, index: number) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </NotificationsContainer>
  );
}

export default App;