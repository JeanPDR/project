import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createShortUrl, getUserUrls, deleteUserUrl } from '../../server/api/urls';
import { PrismaClient } from '@prisma/client';

vi.mock('@prisma/client', () => {
  const mockPrisma = {
    url: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('URL API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('deve criar uma URL encurtada com sucesso', async () => {
      const mockUrl = {
        id: '1',
        longUrl: 'https://exemplo.com',
        shortUrl: 'abc123',
        userId: 'user123',
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.url.create as any).mockResolvedValue(mockUrl);

      const result = await createShortUrl({
        url: 'https://exemplo.com',
        userId: 'user123',
      });

      expect(result).toEqual(mockUrl);
      expect(prisma.url.create).toHaveBeenCalled();
    });

    it('deve lançar erro para URL inválida', async () => {
      await expect(
        createShortUrl({
          url: 'url-invalida',
          userId: 'user123',
        })
      ).rejects.toThrow('Invalid URL');
    });
  });

  describe('getUserUrls', () => {
    it('deve retornar URLs do usuário', async () => {
      const mockUrls = [
        {
          id: '1',
          longUrl: 'https://exemplo1.com',
          shortUrl: 'abc123',
          userId: 'user123',
          clicks: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.url.findMany as any).mockResolvedValue(mockUrls);

      const result = await getUserUrls('user123');

      expect(result).toEqual(mockUrls);
      expect(prisma.url.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('deleteUserUrl', () => {
    it('deve deletar URL do usuário com sucesso', async () => {
      const mockUrl = {
        id: '1',
        userId: 'user123',
      };

      (prisma.url.findUnique as any).mockResolvedValue(mockUrl);
      (prisma.url.delete as any).mockResolvedValue(mockUrl);

      await deleteUserUrl('1', 'user123');

      expect(prisma.url.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve lançar erro ao tentar deletar URL de outro usuário', async () => {
      const mockUrl = {
        id: '1',
        userId: 'outroUsuario',
      };

      (prisma.url.findUnique as any).mockResolvedValue(mockUrl);

      await expect(
        deleteUserUrl('1', 'user123')
      ).rejects.toThrow('URL not found or unauthorized');
    });
  });
});