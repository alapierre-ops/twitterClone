import { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './app/routes';
import NotificationsContainer from './domains/notifications/components/NotificationsContainer';

export interface RouteItem {
  path: string;
  element: ReactElement;
}

function App() {
  return (
    <NotificationsContainer>
      <Router>
        <Routes>
          {routes.map((route: RouteItem, index: number) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </NotificationsContainer>
  );
}

export default App;