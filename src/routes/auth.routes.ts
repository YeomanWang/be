import express from 'express';
import { AuthService } from '../services/auth.service';
import { generateToken, verifyToken} from '../utils/jwt.util';

const router = express.Router();
const authService = new AuthService();

// 登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ message: '用户名和密码不能为空' });
      return
    }

    const {token, refreshToken, user} = await authService.login(username, password);
    res.status(200).json({ success: true, refreshToken, token, user });
  } catch (error) {
    if (error instanceof Error) {
      console.error('登录错误:', error.message);
      res.status(401).json({ success: false, message: error.message });
    }
  }
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh Token 不能为空' });
    return;
  }

  try {
    const decoded = verifyToken(refreshToken) as {id: string, username: string};
    const token = generateToken({ id: decoded.id, username: decoded.username }, '15m');
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('刷新 Token 错误:', error);
    res.status(401).json({ success: false, message: 'Refresh Token 无效' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, email} = req.body;

  try {
    const result = await authService.register(username, password, email);
    res.status(201).json({ success: true, message: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // 获取 Authorization 头中的 token

  if (!token) {
    res.status(400).json({ success: false, message: '未提供 token' });
    return;
  }

  // 这里可以将 token 存入无效 token 黑名单
  // 例如使用 Redis 或数据库存储 token 的黑名单

  res.status(200).json({ success: true, message: '登出成功' });
});

export default router;
