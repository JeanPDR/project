export interface UrlData {
  id: string;
  shortUrl: string;
  longUrl: string;
  clicks: number;
  category: string;
  createdAt: string;
  trackingId?: string | null;
  expiresAt?: string | null;
  isTreeLink?: boolean;
  title?: string;
  description?: string;
  order?: number;
}

export interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro';
}

export interface TreePage {
  id: string;
  userId: string;
  title: string;
  description?: string;
  theme: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  clicksByDay: {
    date: string;
    clicks: number;
  }[];
  clicksByCategory: {
    category: string;
    clicks: number;
  }[];
  topPerformingUrls: {
    shortUrl: string;
    longUrl: string;
    clicks: number;
    category: string;
  }[];
}