import bcrypt from 'bcrypt';
import { scrypt, randomBytes } from 'crypto';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { generateToken } from '../utils/jwt.util';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private salt: string = '';

  // 登录逻辑
  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOneBy({ name: username });
    if (!user) {
      throw new Error('用户名不存在');
    }

    // 验证密码
    const isPasswordValid = await this.verifyPassword(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成 JWT
    const token = generateToken({ id: user.id, username: user.name });
    return token;
  }

  async register(username: string, password: string, email: string): Promise<string> {
    const existingUser = await this.userRepository.findOneBy({ name: username });
    if (existingUser) {
      throw new Error('用户名已存在');
    }
  
    const hashedPassword = await this.hashPassword(password);
  
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
    console.log(inputPassword);
    console.log(storedHash);
    const [salt, storedDerivedKey] = storedHash.split(':');
    console.log(salt);
    console.log(this.salt);
    console.log(storedDerivedKey);
    const hash = await new Promise<string>((resolve, reject) => {
      scrypt(inputPassword, this.salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
    console.log(hash);
    return storedDerivedKey === hash;
  }

  async hashPassword(password: string): Promise<string> {
    this.salt = randomBytes(16).toString('hex');
    const hash = await new Promise<string>((resolve, reject) => {
      scrypt(password, this.salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(this.salt + ':' + derivedKey.toString('hex'));
      });
    });
    return hash;
  }
}

