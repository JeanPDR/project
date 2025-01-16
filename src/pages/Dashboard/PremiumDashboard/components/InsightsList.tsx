interface Insight {
  id: string;
  type: 'performance' | 'alert';
  title: string;
  description: string;
}

interface InsightsListProps {
  insights: Insight[];
}

export default function InsightsList({ insights }: InsightsListProps) {
  return (
    <ul className="space-y-4">
      {insights.map((insight) => (
        <li
          key={insight.id}
          className={`p-4 rounded-lg ${
            insight.type === 'performance'
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <h3 className="font-medium mb-1">{insight.title}</h3>
          <p className="text-sm text-gray-600">{insight.description}</p>
        </li>
      ))}
      {insights.length === 0 && (
        <li className="text-center text-gray-500">
          No insights available yet. Keep using the platform to generate insights!
        </li>
      )}
    </ul>
  );
}