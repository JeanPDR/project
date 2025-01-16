import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TreePage as TreePageType, UrlData } from '../../types';

export default function TreePage() {
  const { slug } = useParams();
  const [page, setPage] = useState<TreePageType | null>(null);
  const [links, setLinks] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`/api/tree/${slug}`);
        setPage(response.data.page);
        setLinks(response.data.links);
      } catch (error) {
        console.error('Failed to fetch tree page:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
          {page.description && (
            <p className="text-gray-600 dark:text-gray-400">{page.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold mb-1">{link.title}</h2>
              {link.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {link.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}