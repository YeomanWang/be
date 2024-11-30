import express from 'express';
import { PhotoService } from '../services/photos.service';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const photoService = new PhotoService();

// 根据用户ID获取该用户所有照片和年龄
router.get('/photos/:userId', authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const photos = await photoService.getPhotosByUserId(userId);
    res.json(photos);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    }
  }
});

// 根据用户ID和年龄获取特定照片
router.get('/photos/:userId/:age', authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.userId);
  const age = parseInt(req.params.age);
  try {
    const photos = await photoService.getPhotosByUserIdAndAge(userId, age);
    res.json(photos);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    }
  }
});

export default router;
