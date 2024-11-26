import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('social_links')
export class SocialLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string;

  @Column()
  url: string;

  @ManyToOne(() => User, user => user.socialLinks)
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}