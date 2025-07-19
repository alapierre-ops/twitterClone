import Index from '../pages/Index';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import PostView from '../pages/Post';
import { RouteItem } from '../App';

const routes: RouteItem[] = [
  { path: '/', element: <Index /> },
  { path: '/login', element: <Login /> },
  { path: '/profile/:id', element: <Profile /> },
  { path: '/post/:id', element: <PostView /> },
];

export default routes; 