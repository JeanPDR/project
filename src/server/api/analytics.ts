import { PrismaClient } from "@prisma/client";
import { AnalyticsData } from "../../types";

const prisma = new PrismaClient();

export async function getAnalytics(userId: string): Promise<AnalyticsData> {
  try {
    // Get clicks by day
    const clicksByDay = await prisma.clickLog.groupBy({
      by: ['timestamp'],
      _count: {
        id: true
      },
      where: {
        url: {
          userId
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    // Get clicks by category
    const clicksByCategory = await prisma.url.groupBy({
      by: ['category'],
      _sum: {
        clicks: true
      },
      where: { userId }
    });

    // Get top performing URLs
    const topUrls = await prisma.url.findMany({
      where: { userId },
      orderBy: {
        clicks: 'desc'
      },
      take: 5
    });

    return {
      clicksByDay: clicksByDay.map(day => ({
        date: day.timestamp.toISOString().split('T')[0],
        clicks: day._count.id
      })),
      clicksByCategory: clicksByCategory.map(cat => ({
        category: cat.category,
        clicks: cat._sum.clicks || 0
      })),
      topPerformingUrls: topUrls.map(url => ({
        shortUrl: url.shortUrl,
        longUrl: url.longUrl,
        clicks: url.clicks,
        category: url.category
      }))
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error('Failed to fetch analytics data');
  }
}