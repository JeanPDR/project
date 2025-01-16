import { useState, useEffect } from 'react';
import { useUserPlan } from '../../hooks/useUserPlan';
import { useDashboard } from './useDashboard';
import { useNavigate } from 'react-router-dom';
import UrlList from './components/UrlList';
import PremiumDashboard from './PremiumDashboard';
import AccessTimeBlock from './components/AccessTimeBlock';

export default function Dashboard() {
  const { plan, loading: planLoading } = useUserPlan();
  const { urls, loading: urlsLoading, handleDelete } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate access based on URL and plan
    const path = window.location.pathname;
    if (plan === 'pro' && !path.startsWith('/pro')) {
      navigate('/pro/dashboard', { replace: true });
    } else if (plan === 'free' && !path.startsWith('/free')) {
      navigate('/free/dashboard', { replace: true });
    }
  }, [plan, navigate]);

  if (planLoading || urlsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {plan === 'pro' ? 'Pro Dashboard' : 'Free Dashboard'}
        </h1>
        {plan === 'free' && (
          <button
            onClick={() => {/* Implement upgrade logic */}}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-md hover:opacity-90"
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      <UrlList urls={urls} onDelete={handleDelete} />
      
      <AccessTimeBlock />

      {plan === 'pro' && <PremiumDashboard />}
    </div>
  );
}