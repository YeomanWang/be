import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY; // 建议放在环境变量中
if (!SECRET_KEY) {
  console.error('SECRET_KEY is not defined in the environment variables');
  process.exit(1); // 如果没有 SECRET_KEY，终止应用
}
// 生成 JWT
export function generateToken(payload: object, expiresIn = '1h'): string {
  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is missing');
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// 验证 JWT
export function verifyToken(token: string): object | null | string {
  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is missing');
  }
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
