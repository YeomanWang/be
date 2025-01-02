import multer from 'multer';
import express from 'express';
import VideoService from '../services/videos.service';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const videoService = new VideoService();

// 根据用户ID获取该用户所有照片和年龄
router.get('/videos/:userId', authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const videos = await videoService.getVideosByUserId(userId);
    res.json(videos);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    }
  }
});

const upload = multer({ dest: 'uploads/' });

router.post('/videos/upload', upload.single('chunk'), async (req, res) => {
  const { userId, videoId, chunkIndex, totalChunks } = req.body;
  if (!req.file) {
    res.status(400).json({ message: '请上传视频文件' });
    return;
  }

  try {
    // 保存分片信息到数据库
    await videoService.saveChunk({
      userId,
      videoId,
      chunkIndex: parseInt(chunkIndex, 10),
      totalChunks: parseInt(totalChunks, 10),
      filePath: req.file.path,
    });

    // 检查是否所有分片都已上传完成
    const isComplete = await videoService.isUploadComplete(videoId, totalChunks);
    if (isComplete) {
      // 合并分片
      await videoService.mergeChunks(videoId, totalChunks);
      res.status(201).json({ success: true, message: '视频上传成功' });
    } else {
      res.status(200).json({ success: true, message: '分片上传成功' });
    }
  } catch (error) {
    console.error('视频上传错误:', error);
    res.status(500).json({ success: false, message: '视频上传失败，请稍后再试' });
  }
});

export default router;