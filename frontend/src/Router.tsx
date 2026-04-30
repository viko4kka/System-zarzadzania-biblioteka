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
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([

// Paths for public
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/books',
    element:  <MainLayout ><Books /></MainLayout>
  },

// Paths for admin
  {
    path: '/admin/dashboard',
    element:<MainLayout > <ADashboard /></MainLayout>,
  },
  {
    path: '/admin/history',
    element: <MainLayout ><AHistory /></MainLayout>,
  },
  {
    path: '/admin/loans',
    element: <MainLayout ><ALoans /></MainLayout>,
  },
  {
    path: '/admin/profile',
    element: <MainLayout ><AProfile /></MainLayout>,
  },
  {
    path: '/admin/users',
    element: <MainLayout ><AUsers /></MainLayout>,
  },

//   Paths for user
  {
    path: '/user/dashboard',
    element: <MainLayout ><UDashboard /></MainLayout>,
    
  },
  {
    path: '/user/history',
    element: <MainLayout ><UHistory /></MainLayout>,
  },
  {
    path: '/user/loans',
    element: <MainLayout ><ULoans /></MainLayout>,
  },
  {
    path: '/user/profile',
    element:  <MainLayout ><UProfile /></MainLayout>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
