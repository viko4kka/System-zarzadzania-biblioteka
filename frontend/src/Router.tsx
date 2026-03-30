import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Public
import Login from './pages/public/login/page';
import Books from './pages/public/books/page';
// Admin
import ADashboard from './pages/admin/dashboard/page';
import AHistory from './pages/admin/history/page';
import ALoans from './pages/admin/loans/page';
import AProfile from './pages/admin/profile/page';
import AUsers from './pages/admin/users/page';
// User
import UDashboard from './pages/user/dashboard/page';
import UHistory from './pages/user/history/page';
import ULoans from './pages/user/loans/page';
import UProfile from './pages/user/profile/page';

const router = createBrowserRouter([

// Paths for public
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/books',
    element: <Books />
  },

// Paths for admin
  {
    path: '/admin/dashboard',
    element: <ADashboard />,
  },
  {
    path: '/admin/history',
    element: <AHistory />,
  },
  {
    path: '/admin/loans',
    element: <ALoans />,
  },
  {
    path: '/admin/profile',
    element: <AProfile />,
  },
  {
    path: '/admin/users',
    element: <AUsers />,
  },

//   Paths for user
  {
    path: '/user/dashboard',
    element: <UDashboard />,
    
  },
  {
    path: '/user/history',
    element: <UHistory />,
  },
  {
    path: '/user/loans',
    element: <ULoans />,
  },
  {
    path: '/user/profile',
    element: <UProfile />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
