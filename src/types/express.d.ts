import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: MulterFile;
    files?: MulterFile[];
  }
}

interface MulterFile {
  fieldname: string; // 表单字段名
  originalname: string; // 用户上传的文件名
  encoding: string; // 文件编码
  mimetype: string; // 文件 MIME 类型
  size: number; // 文件大小 (bytes)
  destination: string; // 存储的目标目录
  filename: string; // 存储时的文件名
  path: string; // 文件的完整路径
  buffer?: Buffer; // 如果未保存到磁盘，可能会包含文件数据
}
