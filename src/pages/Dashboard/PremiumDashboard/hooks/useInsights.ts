import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useDashboard } from '../../useDashboard';

interface Insight {
  id: string;
  type: 'performance' | 'alert';
  title: string;
  description: string;
}

export function useInsights() {
  const { urls } = useDashboard();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = () => {
      const newInsights: Insight[] = [];

      if (urls.length > 0) {
        // Top performing URL insight
        const topUrl = [...urls].sort((a, b) => b.clicks - a.clicks)[0];
        newInsights.push({
          id: 'top-url',
          type: 'performance',
          title: 'Top Performing URL',
          description: `Your URL "${topUrl.shortUrl}" is performing well with ${topUrl.clicks} clicks!`,
        });

        // Category performance insight
        const categoryClicks = urls.reduce((acc, url) => {
          acc[url.category] = (acc[url.category] || 0) + url.clicks;
          return acc;
        }, {} as Record<string, number>);

        const topCategory = Object.entries(categoryClicks)
          .sort(([, a], [, b]) => b - a)[0];

        if (topCategory) {
          newInsights.push({
            id: 'top-category',
            type: 'performance',
            title: 'Best Performing Category',
            description: `Links in the "${topCategory[0]}" category are getting the most engagement!`,
          });
        }

        // Growth insight
        const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
        if (totalClicks > 0) {
          newInsights.push({
            id: 'total-performance',
            type: 'performance',
            title: 'Overall Performance',
            description: `Your links have received ${totalClicks} total clicks!`,
          });
        }

        // Low performing URLs alert
        const lowPerformingUrls = urls.filter(url => url.clicks === 0);
        if (lowPerformingUrls.length > 0) {
          newInsights.push({
            id: 'low-performing',
            type: 'alert',
            title: 'Inactive Links Detected',
            description: `You have ${lowPerformingUrls.length} links with no clicks. Consider sharing them more!`,
          });
        }
      }

      setInsights(newInsights);
      setLoading(false);
    };

    generateInsights();
  }, [urls]);

  return { insights, loading };
}