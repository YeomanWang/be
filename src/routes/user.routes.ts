import express from 'express';
import { UserService } from '../services/user';
const router = express.Router();
const userService = new UserService();
router.post('/user', express.json(), async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await userService.createUser(name, email);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// 获取所有用户
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// 获取单个用户
router.get('/user/:id', async (req, res) => {
  console.log(req);
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// 更新用户
router.put('/user/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const updatedUser = await userService.updateUser(id, name, email);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
});

// 删除用户
router.delete('/user/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await userService.deleteUser(id);
    res.status(204).send();  // 204 No Content 表示成功删除用户
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

export default router;