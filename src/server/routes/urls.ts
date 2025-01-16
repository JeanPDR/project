import express from "express";
import { PrismaClient } from '@prisma/client';
import {
  createShortUrl,
  getUrlByTrackingId,
  logUrlClick,
  getUrlClickLogs,
  getUrlByShortUrl
} from "../api/urls";

const router = express.Router();
const prisma = new PrismaClient();

// Redirect route
router.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await getUrlByShortUrl(shortUrl);

    if (!url) {
      return res.status(404).send("URL not found");
    }

    // Log the click
    await logUrlClick(url.id, {
      region: req.query.region as string,
      city: req.query.city as string
    });

    // Redirect to the long URL
    res.redirect(url.longUrl);
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).send("Error redirecting to URL");
  }
});

// Create short URL
router.post("/urls", async (req, res) => {
  try {
    const { url, userId, category, customPath } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }
    const shortUrl = await createShortUrl({ 
      url, 
      userId, 
      category: category || 'other',
      customPath,
      isAnonymous: !userId 
    });
    res.json(shortUrl);
  } catch (error: any) {
    console.error("Create URL Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get URLs for a user
router.get("/urls/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const urls = await prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(urls);
  } catch (error: any) {
    console.error("Get URLs Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete URL
router.delete("/urls/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.url.delete({
      where: { id }
    });
    res.json({ message: "URL deleted successfully" });
  } catch (error: any) {
    console.error("Delete URL Error:", error);
    res.status(500).json({ message: "Failed to delete URL" });
  }
});

// Get URL by tracking ID
router.get("/urls/track/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;
    const url = await getUrlByTrackingId(trackingId);
    res.json(url);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

// Log click with location
router.post("/urls/:urlId/click", async (req, res) => {
  try {
    const { urlId } = req.params;
    const { region, city } = req.body;
    
    await logUrlClick(urlId, { region, city });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Click logging error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get click logs for a URL
router.get("/urls/:urlId/clicks", async (req, res) => {
  try {
    const { urlId } = req.params;
    const logs = await getUrlClickLogs(urlId);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export { router as urlRoutes };