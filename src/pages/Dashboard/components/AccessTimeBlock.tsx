import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

interface ClickTime {
  hour: number;
  clicks: number;
}

export default function AccessTimeBlock() {
  const [clickTimes, setClickTimes] = useState<ClickTime[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchClickTimes = async () => {
      try {
        if (!user?.id) return;
        const response = await axios.get(`/api/analytics/clicks/time/${user.id}`);
        
        // Format data for chart
        const formattedData = response.data.map((item: ClickTime) => ({
          hour: formatHour(item.hour),
          clicks: item.clicks
        }));
        
        setClickTimes(formattedData);
      } catch (error) {
        console.error('Failed to fetch click times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClickTimes();
  }, [user?.id]);

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
  };

  if (loading) {
    return <div>Loading access times...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Access Times</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clickTimes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="clicks" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}