import { useState, useEffect } from 'react';
import axios from 'axios';

interface GeoData {
  country: string;
  clicks: number;
}

export function useGeoAnalytics(userId: string) {
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await axios.get(`/api/analytics/geo/${userId}`);
        setGeoData(response.data);
      } catch (error) {
        console.error('Failed to fetch geo analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGeoData();
    }
  }, [userId]);

  return { geoData, loading };
}