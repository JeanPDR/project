import express from 'express';
import { getUserPlan, createUser, updateUserPlan } from '../api/users';

const router = express.Router();

// Get user plan
router.get('/users/:userId/plan', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Getting plan for user:', userId);
    const plan = await getUserPlan(userId);
    console.log('User plan:', plan);
    res.json({ plan });
  } catch (error: any) {
    console.error('Error getting user plan:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { userId, email } = req.body;
    console.log('Creating/updating user:', { userId, email });
    const user = await createUser(userId, email);
    console.log('User created/updated:', user);
    res.json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update user plan
router.put('/users/:userId/plan', async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan } = req.body;
    const user = await updateUserPlan(userId, plan);
    res.json(user);
  } catch (error: any) {
    console.error('Error updating user plan:', error);
    res.status(400).json({ message: error.message });
  }
});

export { router as userRoutes };