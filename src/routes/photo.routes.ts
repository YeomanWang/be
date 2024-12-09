import express from 'express';
import { PhotoService } from '../services/photos.service';
import authMiddleware from '../middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();
const photoService = new PhotoService();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 设置上传文件的存储目录
  },
  filename: (req, file, cb) => {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制文件大小为 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('仅支持上传 JPG 和 PNG 格式的图片'));
    }
  }
});

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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  try {
    const photos = await photoService.getPhotosByUserIdAndAgeWithPagination(userId, age, page, limit);
    res.json(photos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post('/photos/upload', upload.array('photos',10), async (req, res) => {
  const {age, userId} = req.body;
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ message: '请上传照片' });
    return;
  }

  const photoPaths = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
  try {
    // 保存照片信息到数据库
    await photoService.savePhoto({
      userId,
      age: parseInt(age, 10),
      photos: photoPaths, // 文件存储路径
    });

    res.status(201).json({ success: true, message: '照片上传成功' });
  } catch (error) {
    console.error('照片上传错误:', error);
    res.status(500).json({ success: false, message: '照片上传失败，请稍后再试' });
  }
});

export default router;
