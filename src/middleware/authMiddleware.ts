import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1]; // 提取 Bearer 后的 token
  if (!token) {
    res.status(401).json({ message: 'Invalid token' });
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY as string)
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的 Token' });
  }
};

export default authMiddleware;
