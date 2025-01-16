import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export function useReports() {
  const [downloading, setDownloading] = useState(false);

  const generateReport = async (format: 'csv' | 'pdf') => {
    try {
      setDownloading(true);
      const response = await axios.get(`/api/reports/${format}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    } finally {
      setDownloading(false);
    }
  };

  return { generateReport, downloading };
}