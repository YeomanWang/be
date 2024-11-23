import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

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

  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password
  }
}


