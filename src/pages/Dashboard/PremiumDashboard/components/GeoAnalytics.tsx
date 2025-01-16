import { useState } from 'react';
import { GeoAnalytics as GeoAnalyticsType } from '../../../../types';

interface GeoAnalyticsProps {
  data: GeoAnalyticsType[];
}

export default function GeoAnalytics({ data }: GeoAnalyticsProps) {
  const [view, setView] = useState<'region' | 'city'>('region');

  const aggregateData = (field: 'region' | 'city') => {
    const aggregated = data.reduce((acc, item) => {
      const key = item[field] || 'Unknown';
      if (!acc[key]) {
        acc[key] = { name: key, clicks: 0 };
      }
      acc[key].clicks += item.clicks;
      return acc;
    }, {} as Record<string, { name: string; clicks: number }>);

    return Object.values(aggregated)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  };

  const currentData = aggregateData(view);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Geographic Distribution</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('region')}
            className={`px-3 py-1 rounded ${
              view === 'region'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            Regions
          </button>
          <button
            onClick={() => setView('city')}
            className={`px-3 py-1 rounded ${
              view === 'city'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            Cities
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((item) => {
              const totalClicks = currentData.reduce(
                (sum, i) => sum + i.clicks,
                0
              );
              const percentage = ((item.clicks / totalClicks) * 100).toFixed(1);

              return (
                <tr key={item.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}