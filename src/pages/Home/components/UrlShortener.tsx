import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { createUrl } from '../../../lib/api';
import CategorySelect from '../../Dashboard/components/CategorySelect';
import { useUserPlan } from '../../../hooks/useUserPlan';

export default function UrlShortener() {
  const { user } = useUser();
  const { plan } = useUserPlan();
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    if (plan === 'pro' && customPath) {
      if (!/^[a-zA-Z0-9-]+$/.test(customPath)) {
        toast.error('Custom path can only contain letters, numbers, and hyphens');
        return;
      }
    }

    try {
      setLoading(true);
      const data = await createUrl({
        url,
        category,
        userId: user?.id,
        customPath: plan === 'pro' ? customPath : undefined
      });
      
      setUrl('');
      setCategory('');
      setCustomPath('');
      setShortUrl(data.shortUrl);
      toast.success('URL shortened successfully!');
      
      await navigator.clipboard.writeText(data.shortUrl);
      toast.success('Short URL copied to clipboard!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        
        {plan === 'pro' && (
          <div>
            <div className="flex items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Path (PRO)
              </label>
              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded-full">
                PRO
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-2">
                {window.location.origin}/
              </span>
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="my-custom-url"
                pattern="[a-zA-Z0-9-]+"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        )}

        <CategorySelect value={category} onChange={setCategory} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 dark:text-gray-300 font-medium break-all">
              {shortUrl}
            </p>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shortUrl);
                  toast.success('URL copied to clipboard!');
                } catch (error) {
                  toast.error('Failed to copy URL');
                }
              }}
              className="ml-4 text-blue-500 hover:text-blue-700 whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}