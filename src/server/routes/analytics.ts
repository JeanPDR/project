import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get click times for a user
router.get('/analytics/clicks/time/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has access
    if (req.user?.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get all clicks for user's URLs
    const clicks = await prisma.clickLog.findMany({
      where: {
        url: {
          userId
        }
      },
      select: {
        timestamp: true
      }
    });

    // Aggregate clicks by hour
    const clicksByHour = clicks.reduce((acc: Record<number, number>, click) => {
      const hour = new Date(click.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    // Format data for response
    const formattedData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      clicks: clicksByHour[hour] || 0
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching click times:', error);
    res.status(500).json({ message: 'Failed to fetch click times' });
  }
});

export { router as analyticsRoutes };