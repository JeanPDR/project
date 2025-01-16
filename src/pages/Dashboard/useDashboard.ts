import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { getUrls, deleteUrl } from '../../lib/api';
import { UrlData } from '../../types';

export function useDashboard() {
  const { user } = useUser();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = async () => {
    try {
      if (!user?.id) return;
      
      const data = await getUrls(user.id);
      setUrls(data || []);
    } catch (error) {
      console.error('Failed to fetch URLs:', error);
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUrls();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      setUrls(urls.filter((url) => url.id !== id));
      toast.success('URL deleted successfully');
    } catch (error) {
      console.error('Failed to delete URL:', error);
      toast.error('Failed to delete URL');
    }
  };

  return {
    urls,
    loading,
    handleDelete,
    refreshUrls: fetchUrls
  };
}