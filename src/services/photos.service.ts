import { AppDataSource } from '../data-source';
import { Photos } from '../entities/Photos';

export class PhotoService {
  private photoRepository = AppDataSource.getRepository(Photos);

  // 根据用户ID获取该用户所有照片和年龄
  async getPhotosByUserId(userId: number) {
    return await this.photoRepository.find({
      where: { userId },
      relations: ['user'], // 加载User表数据
    });
  }

  // 根据用户ID和年龄获取该用户在特定年龄的照片
  async getPhotosByUserIdAndAge(userId: number, age: number) {
    return await this.photoRepository.find({
      where: { userId, age },
    });
  }
}
