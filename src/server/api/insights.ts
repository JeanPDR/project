import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInsights(userId: string) {
  try {
    const urls = await prisma.url.findMany({
      where: { userId },
      orderBy: { clicks: 'desc' },
      include: {
        clickLogs: true
      }
    });

    const insights = [];
    
    // Top performing URL insight
    if (urls.length > 0) {
      const topUrl = urls[0];
      insights.push({
        id: 'top-url',
        type: 'performance',
        title: 'Top Performing URL',
        description: `Your URL "${topUrl.shortUrl}" is performing well with ${topUrl.clicks} clicks!`,
      });
    }

    // Best time insight
    const allClickLogs = urls.flatMap(url => url.clickLogs);
    if (allClickLogs.length > 0) {
      const clicksByHour = allClickLogs.reduce((acc, log) => {
        const hour = new Date(log.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const bestHour = Object.entries(clicksByHour)
        .sort(([, a], [, b]) => b - a)[0];

      const formatHour = (hour: number) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}${ampm}`;
      };

      insights.push({
        id: 'best-time',
        type: 'performance',
        title: 'Best Performing Time',
        description: `Your links get the most clicks around ${formatHour(parseInt(bestHour[0]))} with ${bestHour[1]} clicks!`,
      });
    }

    // Category performance insight
    const categoryClicks = urls.reduce((acc, url) => {
      acc[url.category] = (acc[url.category] || 0) + url.clicks;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryClicks)
      .sort(([, a], [, b]) => b - a)[0];

    if (topCategory) {
      insights.push({
        id: 'top-category',
        type: 'performance',
        title: 'Best Performing Category',
        description: `Links in the "${topCategory[0]}" category are getting the most engagement!`,
      });
    }

    // Growth insight
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentClicks = urls.reduce((sum, url) => {
      if (new Date(url.createdAt) >= last30Days) {
        return sum + url.clicks;
      }
      return sum;
    }, 0);

    if (recentClicks > 0) {
      insights.push({
        id: 'recent-performance',
        type: 'performance',
        title: '30-Day Performance',
        description: `You've received ${recentClicks} clicks in the last 30 days!`,
      });
    }

    // Low performing URLs alert
    const lowPerformingUrls = urls.filter(url => url.clicks === 0);
    if (lowPerformingUrls.length > 0) {
      insights.push({
        id: 'low-performing',
        type: 'alert',
        title: 'Inactive Links Detected',
        description: `You have ${lowPerformingUrls.length} links with no clicks. Consider sharing them more!`,
      });
    }

    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error('Failed to generate insights');
  }
}