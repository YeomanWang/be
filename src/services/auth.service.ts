import { scrypt, randomBytes } from 'crypto';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { generateToken } from '../utils/jwt.util';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  // 登录逻辑
  async login(username: string, password: string): Promise<{ token: string; refreshToken: string; user: Partial<User> }> {
    const user = await this.userRepository.findOneBy({ name: username });
    if (!user) {
      throw new Error('用户名不存在');
    }

    // 验证密码
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成 JWT
    const token = generateToken({ id: user.id, username: user.name},  '15m');
    const refreshToken = generateToken({ id: user.id, username: user.name}, '7d');
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
  }

  async register(username: string, password: string, email: string): Promise<string> {
    const existingUser = await this.userRepository.findOneBy({ name: username });
    if (existingUser) {
      throw new Error('用户名已存在');
    }
  
    const hashedPassword = await this.hashPassword(password);
    console.log(hashedPassword);
  
    const newUser = this.userRepository.create({
      name: username,
      password: hashedPassword,
      email
    });
  
    await this.userRepository.save(newUser);
  
    // 生成 JWT
    const token = generateToken({ id: newUser.id, username: newUser.name });
    return token;
  }

  async verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
    const [salt, storedDerivedKey] = storedHash.split(':');
    const hash = await new Promise<string>((resolve, reject) => {
      scrypt(inputPassword, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
    console.log(hash);
    return storedDerivedKey === hash;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = await new Promise<string>((resolve, reject) => {
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
    return `${salt}:${hash}`;
  }
}

