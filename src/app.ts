import express from 'express';
import { User } from './entities/User';
import { AppDataSource } from './data-source';

const app = express();
const port = 3000;

// 数据库连接配置
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.post('/user', express.json(), async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const newUser = userRepository.create(req.body); // 根据请求体创建新用户
  await userRepository.save(newUser); // 保存到数据库
  res.json(newUser);
});
