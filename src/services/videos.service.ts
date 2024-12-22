import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';
import { Videos } from '../entities/Videos';

interface Chunk {
  userId: string;
  videoId: string;
  chunkIndex: number;
  totalChunks: number;
  filePath: string;
}

const chunks: Chunk[] = [];
export class VideosService {
  private videoRepository = AppDataSource.getRepository(Videos);
  saveChunk = async (chunk: Chunk): Promise<void> => {
    chunks.push(chunk);
  };

  isUploadComplete = async (videoId: string, totalChunks: string): Promise<boolean> => {
    const uploadedChunks = chunks.filter(chunk => chunk.videoId === videoId);
    console.log( uploadedChunks.length, parseInt(totalChunks,10))
    return uploadedChunks.length === parseInt(totalChunks,10);
  };
  
  mergeChunks = async (videoId: string, totalChunks: number): Promise<void> => {
    const uploadedChunks = chunks.filter(chunk => chunk.videoId === videoId);
    const sortedChunks = uploadedChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
  
    const videoPath = path.join('uploads', `${videoId}.mp4`);
    const writeStream = fs.createWriteStream(videoPath);
  
    for (const chunk of sortedChunks) {
      const data = fs.readFileSync(chunk.filePath);
      writeStream.write(data);
      fs.unlinkSync(chunk.filePath); // 删除分片文件
    }
  
    writeStream.end();
    const videos = new Videos();
    videos.userId = parseInt(uploadedChunks[0].userId);
    videos.videoPath = videoPath;
    videos.createdAt = new Date();
    await this.videoRepository.save(videos);
  };

  async getVideosByUserId(userId: number) {
    return await this.videoRepository.find({
      where: { userId },
    });
  }
}


export default VideosService;