import { Request, Response, NextFunction } from 'express';
import { Clerk } from '@clerk/backend';

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing CLERK_SECRET_KEY');
}

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authorization header'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid authorization header format'
      });
    }

    try {
      const { sub: userId } = await clerk.verifyToken(token);
      if (!userId) {
        throw new Error('Invalid token');
      }

      req.user = { id: userId };
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication failed'
    });
  }
}