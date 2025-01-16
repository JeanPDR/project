import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// Get URL by short URL
export async function getUrlByShortUrl(shortUrl: string) {
  try {
    return await prisma.url.findFirst({
      where: {
        shortUrl,
        OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
      },
    });
  } catch (error) {
    console.error("Get URL Error:", error);
    throw error;
  }
}

// Create short URL
export async function createShortUrl({
  url,
  userId,
  category = "other",
  customPath,
  isAnonymous = false,
}: {
  url: string;
  userId?: string;
  category?: string;
  customPath?: string;
  isAnonymous?: boolean;
}) {
  try {
    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error("Invalid URL format");
    }

    // Validate userId if provided
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new Error(`User with ID ${userId} does not exist`);
      }
    }

    // If customPath is provided, check if it's already taken
    if (customPath) {
      const existingUrl = await prisma.url.findUnique({
        where: { shortUrl: customPath },
      });

      if (existingUrl) {
        throw new Error("Custom URL is already taken");
      }
    }

    const shortUrl = customPath || nanoid(8);
    const trackingId = isAnonymous ? nanoid(12) : null;

    // Calculate expiration date for anonymous URLs (30 days from now)
    const expiresAt = isAnonymous
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

    // Create the URL record
    const urlRecord = await prisma.url.create({
      data: {
        longUrl: url,
        shortUrl,
        userId: userId || null, // Use null if userId is not provided
        category,
        trackingId,
        expiresAt,
      },
    });

    return {
      ...urlRecord,
      trackingUrl: trackingId ? `/track/${trackingId}` : null,
    };
  } catch (error) {
    console.error("Create URL Error:", error);
    throw error;
  }
}

// Log URL click
export async function logUrlClick(
  urlId: string,
  location?: { region?: string; city?: string }
) {
  try {
    await prisma.clickLog.create({
      data: {
        urlId,
        region: location?.region || null,
        city: location?.city || null,
        timestamp: new Date(),
      },
    });

    await prisma.url.update({
      where: { id: urlId },
      data: { clicks: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error logging click:", error);
    throw error;
  }
}

// Get URL by tracking ID
export async function getUrlByTrackingId(trackingId: string) {
  try {
    const url = await prisma.url.findFirst({
      where: {
        trackingId,
        OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
      },
    });

    if (!url) {
      throw new Error("URL not found or expired");
    }

    return url;
  } catch (error) {
    console.error("Get URL Error:", error);
    throw error;
  }
}

// Get click logs for a URL
export async function getUrlClickLogs(urlId: string) {
  try {
    return await prisma.clickLog.findMany({
      where: { urlId },
      orderBy: { timestamp: "desc" },
    });
  } catch (error) {
    console.error("Error getting click logs:", error);
    throw error;
  }
}
