import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Public
import Login from "./pages/public/login/page";
import Catalog from "./pages/public/books/page";

// Admin
import AHistory from "./pages/admin/history/page";
import ALoans from "./pages/admin/loans/page";
import AProfile from "./pages/admin/profile/page";
import AUsers from "./pages/admin/users/page";

// User
import UHistory from "./pages/user/history/page";
import ULoans from "./pages/user/loans/page";
import UProfile from "./pages/user/profile/page";

import MainLayout from "./layouts/MainLayout";
import Forbidden from "./pages/Forbidden";
import HomePage from "./pages/home/page";
import NotFoundPage from "./pages/public/notFound/page";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/catalog",
    element: (
      <MainLayout>
        <Catalog />
      </MainLayout>
    ),
  },
  {
    path: "/403",
    element: <Forbidden />,
  },

  {
    element: <ProtectedRoute />,
    children: [
  
      {
        path: "/user/history",
        element: (
          <MainLayout>
            <UHistory />
          </MainLayout>
        ),
      },
      {
        path: "/user/loans",
        element: (
          <MainLayout>
            <ULoans />
          </MainLayout>
        ),
      },
      {
        path: "/user/profile",
        element: (
          <MainLayout>
            <UProfile />
          </MainLayout>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute admin />,
    children: [
      // {
      //   path: "/admin/dashboard",
      //   element: (
      //     <MainLayout>
      //       <ADashboard />
      //     </MainLayout>
      //   ),
      // },
      {
        path: "/admin/history",
        element: (
          <MainLayout>
            <AHistory />
          </MainLayout>
        ),
      },
      {
        path: "/admin/loans",
        element: (
          <MainLayout>
            <ALoans />
          </MainLayout>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <MainLayout>
            <AProfile />
          </MainLayout>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <MainLayout>
            <AUsers />
          </MainLayout>
        ),
      },
    ],
  },
  {
        path: '*',
    element: <NotFoundPage />
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
