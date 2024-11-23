import express from 'express';
import { AuthService } from '../services/auth.service';

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

    const token = await authService.login(username, password);
    res.status(200).json({ success: true, token });
  } catch (error) {
    if (error instanceof Error) {
      console.error('登录错误:', error.message);
      res.status(401).json({ success: false, message: error.message });
    }
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

export default router;
