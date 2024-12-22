import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import photosRoutes from './routes/photo.routes';
import videosRoutes from './routes/videos.routes';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const port = 3000;
app.use(express.json({ limit: '50mb' })); // 增加请求体大小限制
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 配置静态资源目录
app.use('/uploads', express.static(uploadsDir));

// 设置请求超时
app.use((req, res, next) => {
  res.setTimeout(100000, () => {
    console.log('Request timed out');
    res.status(408).send('Request Timeout');
  });
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack); // 打印错误堆栈信息
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.use(cors({
  origin: 'http://127.0.0.1:3006', // 允许的前端地址
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的请求方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
}));

// 数据库连接配置
// await AppDataSource.initialize();
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err: any) => {
    console.error('Error during Data Source initialization:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app.use(express.static(__dirname + '/public'));
// app.use('/uploads', express.static('uploads'));
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', photosRoutes);
app.use('/api', videosRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


