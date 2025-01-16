import express from 'express';
import { getInsights } from '../api/insights';
import { requireAuth } from '../middleware/auth';
import { checkProPlan } from '../middleware/checkProPlan';

const router = express.Router();

router.get('/insights', requireAuth, checkProPlan, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const insights = await getInsights(userId);
    res.json(insights);
  } catch (error: any) {
    console.error('Insights Error:', error);
    res.status(500).json({ message: error.message });
  }
});

export { router as insightsRoutes };