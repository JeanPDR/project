import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export function useUserPlan() {
  const { user } = useUser();
  const [plan, setPlan] = useState<'free' | 'pro' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        if (!user?.id) return;

        // Create or get user first
        await axios.post('/api/users', {
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        });

        // Then fetch user plan
        const response = await axios.get(`/api/users/${user.id}/plan`);
        console.log('User plan response:', response.data); // Debug log
        setPlan(response.data.plan);
      } catch (error) {
        console.error('Error fetching user plan:', error);
        toast.error('Failed to load user plan');
        setPlan('free'); // Fallback to free plan
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserPlan();
    } else {
      setLoading(false);
    }
  }, [user?.id, user?.primaryEmailAddress?.emailAddress]);

  return { plan, loading };
}