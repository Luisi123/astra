import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export interface AuthRequest extends Request {
  user?: {
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    if (!decoded.email) {
      return res.status(403).json({ 
        message: 'Invalid token format.',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('Token verification failed:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      message: 'Invalid token.',
      code: 'INVALID_TOKEN'
    });
  }
}; 