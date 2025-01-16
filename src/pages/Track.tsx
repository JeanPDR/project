import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UrlData } from '../types';

interface ClickLog {
  id: string;
  region: string | null;
  city: string | null;
  timestamp: string;
}

export default function Track() {
  const { trackingId } = useParams();
  const [url, setUrl] = useState<UrlData | null>(null);
  const [clickLogs, setClickLogs] = useState<ClickLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!trackingId) return;
        
        const urlResponse = await axios.get(`/api/urls/track/${trackingId}`);
        setUrl(urlResponse.data);
        
        const logsResponse = await axios.get(`/api/urls/${urlResponse.data.id}/clicks`);
        setClickLogs(logsResponse.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch data');
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trackingId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !url) {
    return (
      <div className="text-center py-8 text-red-600">
        {error || 'URL not found'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">URL Statistics</h1>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Original URL:</span>{' '}
            <a href={url.longUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              {url.longUrl}
            </a>
          </p>
          <p>
            <span className="font-medium">Short URL:</span>{' '}
            <span className="text-gray-600 dark:text-gray-300">{url.shortUrl}</span>
          </p>
          <p>
            <span className="font-medium">Total Clicks:</span>{' '}
            <span className="text-gray-600 dark:text-gray-300">{url.clicks}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Click History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clickLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {[log.city, log.region]
                      .filter(Boolean)
                      .join(', ') || 'Location not available'}
                  </td>
                </tr>
              ))}
              {clickLogs.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No clicks recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}