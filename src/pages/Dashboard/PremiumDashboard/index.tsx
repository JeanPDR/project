import { useUser } from '@clerk/clerk-react';
import { useUrlAnalytics } from './hooks/useUrlAnalytics';
import { useInsights } from './hooks/useInsights';
import AnalyticsChart from './components/AnalyticsChart';
import ClicksByCategory from './components/ClicksByCategory';
import TopPerformingUrls from './components/TopPerformingUrls';
import InsightsList from './components/InsightsList';

export default function PremiumDashboard() {
  const { user } = useUser();
  const { data: analyticsData, loading: analyticsLoading } = useUrlAnalytics();
  const { insights, loading: insightsLoading } = useInsights();

  if (analyticsLoading || insightsLoading) {
    return <div>Loading premium features...</div>;
  }

  return (
    <div className="space-y-8 mt-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
        {analyticsData && <AnalyticsChart data={analyticsData.clicksByDay} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {analyticsData && <ClicksByCategory data={analyticsData.clicksByCategory} />}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {analyticsData && <TopPerformingUrls data={analyticsData.topPerformingUrls} />}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <InsightsList insights={insights} />
      </div>
    </div>
  );
}