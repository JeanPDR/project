import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkProPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user || user.plan !== 'pro') {
      return res.status(403).json({ 
        message: 'Esta funcionalidade requer plano PRO',
        code: 'UPGRADE_REQUIRED'
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar plano:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}