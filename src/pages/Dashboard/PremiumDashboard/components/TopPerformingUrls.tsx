import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopPerformingUrlsProps {
  data: {
    shortUrl: string;
    longUrl: string;
    clicks: number;
    category: string;
  }[];
}

export default function TopPerformingUrls({ data }: TopPerformingUrlsProps) {
  return (
    <div className="h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Top Performing URLs</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="shortUrl" />
          <YAxis />
          <Tooltip
            content={({ payload, label }) => {
              if (payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-semibold">{data.longUrl}</p>
                    <p>Clicks: {data.clicks}</p>
                    <p>Category: {data.category}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="clicks" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}