import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Aa1993423.",
  database: process.env.DB_NAME || "mysql",
  synchronize: true, // 仅在开发环境中使用，生产环境应关闭
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

