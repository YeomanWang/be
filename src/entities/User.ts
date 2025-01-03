import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photos } from './Photos';
import { Videos } from './Videos';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number ;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password!: string; // 新增密码字段

  @OneToMany(() => Photos, (photo) => photo.user)
  photos!: Photos[]; // 一对多关系，一个用户可以有多张照片

  @OneToMany(() => Videos, (video) => video.user)
  videos!: Videos[]; // 一对多关系，一个用户可以有多个视频

  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password
  }
}


