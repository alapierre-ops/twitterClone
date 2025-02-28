import Index from '../pages/Index';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import { RouteItem } from '../App';

const routes: RouteItem[] = [
  { path: '/', element: <Index /> },
  { path: '/login', element: <Login /> },
  { path: '/profile', element: <Profile /> },
];

export default routes; 