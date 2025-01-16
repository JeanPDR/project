import { RouteObject } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sign-in/*', element: <SignIn routing="path" path="/sign-in" /> },
      { path: 'sign-up/*', element: <SignUp routing="path" path="/sign-up" /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
];