import express from 'express';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import photosRoutes from './routes/photo.routes';

const app = express();
const port = 3000;
app.use(express.json());
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

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', photosRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


