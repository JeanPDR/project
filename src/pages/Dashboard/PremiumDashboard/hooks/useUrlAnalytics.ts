import { useState, useEffect } from 'react';
import { useDashboard } from '../../useDashboard';
import { AnalyticsData } from '../../../../types';

export function useUrlAnalytics() {
  const { urls } = useDashboard();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateAnalytics = () => {
      // Prepare clicks by day data
      const clicksByDay = urls.reduce((acc: { date: string; clicks: number }[], url) => {
        const date = new Date(url.createdAt).toISOString().split('T')[0];
        const existingDay = acc.find(day => day.date === date);
        if (existingDay) {
          existingDay.clicks += url.clicks;
        } else {
          acc.push({ date, clicks: url.clicks });
        }
        return acc;
      }, []);

      // Prepare clicks by category data
      const clicksByCategory = urls.reduce((acc: { category: string; clicks: number }[], url) => {
        const existingCategory = acc.find(cat => cat.category === url.category);
        if (existingCategory) {
          existingCategory.clicks += url.clicks;
        } else {
          acc.push({ category: url.category, clicks: url.clicks });
        }
        return acc;
      }, []);

      // Get top performing URLs
      const topPerformingUrls = [...urls]
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5)
        .map(url => ({
          shortUrl: url.shortUrl,
          longUrl: url.longUrl,
          clicks: url.clicks,
          category: url.category,
        }));

      setData({
        clicksByDay,
        clicksByCategory,
        topPerformingUrls,
      });
      setLoading(false);
    };

    generateAnalytics();
  }, [urls]);

  return { data, loading };
}