import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./entities/User";
import { Photos } from './entities/Photos';
import { Videos } from './entities/Videos';
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3000"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  synchronize: true, // 仅在开发环境中使用，生产环境应关闭
  logging: true,
  entities: [User,Photos, Videos],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

