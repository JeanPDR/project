import { useState } from 'react';
import { UrlData } from '../../../types';
import { toast } from 'react-hot-toast';
import QRCodeModal from '../../../components/QRCodeModal';

interface UrlListProps {
  urls: UrlData[];
  onDelete: (id: string) => void;
}

export default function UrlList({ urls, onDelete }: UrlListProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const copyUrl = async (shortUrl: string) => {
    try {
      const domain = window.location.origin;
      const fullUrl = `${domain}/${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your URLs</h3>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {urls.map((url) => (
            <li key={url.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {url.longUrl}
                  </p>
                  <div className="mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Short URL: {window.location.origin}/{url.shortUrl}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded">
                        {url.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {url.clicks} clicks
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedUrl(`${window.location.origin}/${url.shortUrl}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    QR Code
                  </button>
                  <button
                    onClick={() => copyUrl(url.shortUrl)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => onDelete(url.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {urls.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
              No URLs yet. Create your first short URL above!
            </li>
          )}
        </ul>
      </div>
      {selectedUrl && (
        <QRCodeModal
          url={selectedUrl}
          onClose={() => setSelectedUrl(null)}
        />
      )}
    </div>
  );
}