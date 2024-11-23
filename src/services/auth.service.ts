import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { generateToken } from '../utils/jwt.util';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  // 登录逻辑
  async login(name: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOneBy({ name });
    if (!user) {
      throw new Error('用户名不存在');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成 JWT
    const token = generateToken({ id: user.id, username: user.name });
    return token;
  }
}

