import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    // Support multiple token sources: Authorization header (Bearer), body.token, query.token
    let token: string | undefined = undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (typeof req.body?.token === 'string') {
      token = req.body.token;
    } else if (typeof req.query?.token === 'string') {
      token = req.query.token as string;
    }

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'No token provided. Include Bearer token or provide token in body/query' 
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: 'Token has expired. Please login again' 
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please login again' 
      });
      return;
    }

    res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};