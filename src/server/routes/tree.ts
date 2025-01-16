import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create tree page
router.post('/tree', requireAuth, async (req, res) => {
  try {
    const { title, description, slug, theme, logoUrl } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate required fields
    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and slug are required' });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ 
        message: 'Slug can only contain lowercase letters, numbers, and hyphens' 
      });
    }

    // Check if slug is already taken
    const existing = await prisma.treePage.findUnique({
      where: { slug }
    });

    if (existing) {
      return res.status(400).json({ message: 'This URL is already taken' });
    }

    // First, ensure the user exists in the database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist, create them
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: req.user?.email || `${userId}@example.com`, // Fallback email
            plan: 'free'
          }
        });
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Failed to create user' });
      }
    }

    // Now create the tree page
    const page = await prisma.treePage.create({
      data: {
        title,
        description,
        slug,
        theme: theme || { background: '#ffffff', text: '#000000', accent: '#0066ff' },
        logoUrl,
        userId: user.id
      }
    });

    // Return the page with the public URL
    res.json({
      ...page,
      url: `${process.env.VITE_PUBLIC_URL}/${page.slug}`
    });
  } catch (error) {
    console.error('Create tree page error:', error);
    res.status(500).json({ message: 'Failed to create tree page' });
  }
});

// Get tree page
router.get('/tree/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await prisma.treePage.findUnique({
      where: { slug },
      include: {
        urls: {
          where: { isTreeLink: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Get tree page error:', error);
    res.status(500).json({ message: 'Failed to get tree page' });
  }
});

// Update tree page
router.put('/tree/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, theme, logoUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = await prisma.treePage.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found or unauthorized' });
    }

    const updatedPage = await prisma.treePage.update({
      where: { id },
      data: {
        title,
        description,
        theme,
        logoUrl
      }
    });

    res.json(updatedPage);
  } catch (error) {
    console.error('Update tree page error:', error);
    res.status(500).json({ message: 'Failed to update tree page' });
  }
});

// Delete tree page
router.delete('/tree/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = await prisma.treePage.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found or unauthorized' });
    }

    await prisma.treePage.delete({
      where: { id }
    });

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete tree page error:', error);
    res.status(500).json({ message: 'Failed to delete tree page' });
  }
});

export { router as treeRoutes };