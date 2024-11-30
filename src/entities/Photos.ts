import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Photos {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('json')
  photos!: string[]; // 照片的路径或URL

  @Column()
  age!: number; // 年龄字段

  @Column()
  userId!: number; // 外键，关联User表的id

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // 定义外键关系
  user!: User;
}
