import axios from 'axios';
import { UrlData } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

export const createUrl = async (data: { 
  url: string; 
  userId?: string; 
  category?: string;
  customPath?: string;
}): Promise<UrlData> => {
  try {
    const response = await api.post('/urls', data);
    return response.data;
  } catch (error: any) {
    console.error('Create URL Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Error creating URL');
  }
};

export const getUrls = async (userId?: string): Promise<UrlData[]> => {
  if (!userId) {
    return [];
  }
  
  try {
    const response = await api.get(`/urls/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get URLs Error:', error.response?.data || error);
    throw new Error('Error fetching URLs');
  }
};

export const deleteUrl = async (id: string): Promise<void> => {
  try {
    await api.delete(`/urls/${id}`);
  } catch (error: any) {
    console.error('Delete URL Error:', error.response?.data || error);
    throw new Error('Error deleting URL');
  }
};

export const createTreePage = async (data: {
  title: string;
  description?: string;
  slug: string;
  theme?: any;
  logoUrl?: string;
}) => {
  try {
    const response = await api.post('/tree', data);
    return response.data;
  } catch (error: any) {
    console.error('Create Tree Page Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Error creating tree page');
  }
};