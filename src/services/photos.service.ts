import { AppDataSource } from '../data-source';
import { Photos } from '../entities/Photos';

export class PhotoService {
  private photoRepository = AppDataSource.getRepository(Photos);

  // 根据用户ID获取该用户所有照片和年龄
  async getPhotosByUserId(userId: number) {
    return await this.photoRepository.find({
      where: { userId },
    });
  }

  // 根据用户ID和年龄获取该用户在特定年龄的照片
  async getPhotosByUserIdAndAge(userId: number, age: number) {
    return await this.photoRepository.find({
      where: { userId, age },
    });
  }

  async getPhotosByUserIdAndAgeWithPagination(userId: number, age: number, page: number, limit: number) {
    return await this.photoRepository.find({
      where: { userId, age },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async savePhoto(photoData: { userId: number; age: number; photos: string[] }) {

    const photoRecords = photoData.photos.map((photoPath) => {
      return this.photoRepository.create({
        userId: photoData.userId,
        age: photoData.age,
        photo: photoPath, // 每张照片单独存储
      });
    });

    return await this.photoRepository.save(photoRecords);
  }
}
