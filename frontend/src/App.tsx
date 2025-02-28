import { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './app/routes';

export interface RouteItem {
  path: string;
  element: ReactElement;
}

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route: RouteItem, index: number) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;