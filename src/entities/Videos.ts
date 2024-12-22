import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Videos {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('json')
  videoPath!: string; // 视频的路径或URL

  @Column()
  userId!: number; // 外键，关联User表的id

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // 定义外键关系
  user!: User;
}
