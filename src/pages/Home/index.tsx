import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import QRCodeModal from '../../components/QRCodeModal';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/urls', {
        url,
        isAnonymous: true
      });

      const domain = window.location.origin;
      const fullShortUrl = `${domain}/${response.data.shortUrl}`;
      setShortUrl(fullShortUrl);
      
      if (response.data.trackingId) {
        const fullTrackingUrl = `${domain}/track/${response.data.trackingId}`;
        setTrackingUrl(fullTrackingUrl);
        toast.success(
          <div>
            URL shortened successfully!<br/>
            <a 
              href={fullTrackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Click here to track your URL stats
            </a>
          </div>,
          { duration: 6000 }
        );
      }

      setUrl('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async (urlToCopy: string) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        Shorten Your Links, Expand Your Reach
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Create short, memorable links that redirect to your long URLs
      </p>

      <div className="max-w-2xl mx-auto mb-8">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Your Short URL
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 dark:text-gray-300 font-medium break-all">
                    {shortUrl}
                  </p>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => copyUrl(shortUrl)}
                      className="text-blue-500 hover:text-blue-700 whitespace-nowrap"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => setShowQR(true)}
                      className="text-blue-500 hover:text-blue-700 whitespace-nowrap"
                    >
                      QR Code
                    </button>
                  </div>
                </div>
              </div>

              {trackingUrl && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Track Your URL
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700 dark:text-gray-300 font-medium break-all">
                      {trackingUrl}
                    </p>
                    <button
                      onClick={() => copyUrl(trackingUrl)}
                      className="ml-4 text-blue-500 hover:text-blue-700 whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Save this tracking URL to monitor your link's performance
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showQR && shortUrl && (
          <QRCodeModal url={shortUrl} onClose={() => setShowQR(false)} />
        )}
      </div>

      <SignedOut>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Want more features? Create an account for:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
            <li className="flex items-center">
              <span className="mr-2">✓</span> Custom URLs
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Detailed analytics
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> No expiration date
            </li>
          </ul>
          <Link
            to="/sign-up"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600"
          >
            Sign Up - It's Free
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </SignedOut>
    </div>
  );
}