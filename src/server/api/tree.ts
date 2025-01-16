import { PrismaClient } from "@prisma/client";
import { TreePage } from "../../types";

const prisma = new PrismaClient();

export async function createTreePage({
  userId,
  title,
  description,
  slug,
  theme = 'default'
}: {
  userId: string;
  title: string;
  description?: string;
  slug: string;
  theme?: string;
}): Promise<TreePage> {
  try {
    // Check if slug is already taken
    const existing = await prisma.treePage.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new Error('This URL is already taken');
    }

    return await prisma.treePage.create({
      data: {
        userId,
        title,
        description,
        slug,
        theme
      }
    });
  } catch (error) {
    console.error('Create tree page error:', error);
    throw error;
  }
}

export async function getTreePage(slug: string) {
  try {
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
      throw new Error('Page not found');
    }

    return page;
  } catch (error) {
    console.error('Get tree page error:', error);
    throw error;
  }
}

export async function updateTreePage(
  id: string,
  userId: string,
  data: Partial<TreePage>
) {
  try {
    const page = await prisma.treePage.findUnique({
      where: { id }
    });

    if (!page || page.userId !== userId) {
      throw new Error('Page not found or unauthorized');
    }

    return await prisma.treePage.update({
      where: { id },
      data
    });
  } catch (error) {
    console.error('Update tree page error:', error);
    throw error;
  }
}

export async function deleteTreePage(id: string, userId: string) {
  try {
    const page = await prisma.treePage.findUnique({
      where: { id }
    });

    if (!page || page.userId !== userId) {
      throw new Error('Page not found or unauthorized');
    }

    await prisma.treePage.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Delete tree page error:', error);
    throw error;
  }
}