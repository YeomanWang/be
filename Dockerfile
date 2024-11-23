# 使用官方 Node.js 镜像
FROM node:16

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN yarn

# 安装 ts-node 和 TypeScript
# RUN npm install --save-dev ts-node typescript @types/node @types/express

# 复制项目文件
COPY src/ ./src/

# 暴露端口
EXPOSE 3000

# 使用 ts-node 启动应用
CMD ["npm", "run", "dev"]
