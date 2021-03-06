import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { User } from './User';
import { ArticleTag } from './ArticleTag';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  subtitle: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column()
  authorId: number;

  @Column({ default: () => 'NOW()', type: 'timestamptz' })
  // @CreateDateColumn()
  createdAt: Date;

  @Column({ default: () => 'NOW()', type: 'timestamptz' })
  // @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt: Date;

  @ManyToOne((type) => User, (user) => user.articles)
  author: User;

  @OneToMany((type) => ArticleTag, (tag) => tag.article, { eager: true })
  tags: ArticleTag[];
}
