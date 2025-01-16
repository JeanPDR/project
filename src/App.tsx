import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Track from './pages/Track';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { useUserPlan } from './hooks/useUserPlan';

function DashboardWrapper() {
  const { plan } = useUserPlan();
  const basePath = plan === 'pro' ? '/pro' : '/free';
  return <Navigate to={`${basePath}/dashboard`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="/sign-in/*"
          element={
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/free/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/track/:trackingId" element={<Track />} />
      </Route>
    </Routes>
  );
}