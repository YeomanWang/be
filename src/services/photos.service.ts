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

  async savePhoto(photoData: { userId: number; age: number; photos: string[] }) {
    const existingPhoto = await this.photoRepository.findOne({
      where: {
        userId: photoData.userId,
        age: photoData.age,
      },
    });

    if (existingPhoto) {
      // 如果找到了对应年龄的照片记录，则将新的照片路径添加到该记录的 photos 字段中
      existingPhoto.photos.push(...photoData.photos); // 合并新照片
      return await this.photoRepository.save(existingPhoto); // 更新该记录
    } else {
      // 如果没有该年龄的记录，则创建一条新的记录
      const newPhoto = this.photoRepository.create(photoData);
      return await this.photoRepository.save(newPhoto); // 保存新记录
    }
  }
}
