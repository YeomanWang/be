
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  // 创建用户
  async createUser(name: string, email: string): Promise<User> {
    const newUser = this.userRepository.create({ name, email });
    return await this.userRepository.save(newUser);
  }

  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // 获取单个用户
  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  // 更新用户
  async updateUser(id: number, name: string, email: string): Promise<User | null> {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }
    user.name = name;
    user.email = email;
    return await this.userRepository.save(user);
  }

  // 删除用户
  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    if (user) {
      await this.userRepository.remove(user);
    }
  }
}
