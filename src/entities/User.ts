import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async hashPassword() {
    // 在插入用户之前，对密码进行加密
    this.password = await bcrypt.hash(this.password, 10);
  }

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}


