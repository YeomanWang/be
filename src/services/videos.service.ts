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

export class VideosService {
  private videoRepository = AppDataSource.getRepository(Videos);
  private chunksMap = new Map<string, Chunk[]>();
  saveChunk = async (chunk: Chunk): Promise<void> => {
    if (!this.chunksMap.has(chunk.videoId)) {
      this.chunksMap.set(chunk.videoId, []);
    }
    const videoChunks = this.chunksMap.get(chunk.videoId)!;
    const isDuplicate = videoChunks.some(existingChunk => existingChunk.chunkIndex === chunk.chunkIndex);
    if (isDuplicate) {
      console.log(`Chunk ${chunk.chunkIndex} of video ${chunk.videoId} already exists. Skipping upload.`);
      return; 
    }
    videoChunks.push(chunk);
  };

  isUploadComplete = async (videoId: string, totalChunks: string): Promise<boolean> => {
    const uploadedChunks = this.chunksMap.get(videoId) || [];
    const totalChunksNumber = parseInt(totalChunks, 10);
    console.log(uploadedChunks.length, totalChunksNumber);

    if (isNaN(totalChunksNumber)) {
      throw new Error(`Invalid totalChunks value: ${totalChunks}`);
    }

    return uploadedChunks.length === totalChunksNumber;
  };
  
  mergeChunks = async (videoId: string, totalChunks: number): Promise<void> => {
    console.log(videoId, totalChunks);
    // const uploadedChunks = chunks.filter(chunk => chunk.videoId === videoId);
    const uploadedChunks = this.chunksMap.get(videoId) || [];
    const sortedChunks = uploadedChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    console.log(uploadedChunks);
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