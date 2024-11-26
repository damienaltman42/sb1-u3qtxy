import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Roulette } from '../../roulettes/entities/roulette.entity';
import { Win } from '../../wins/entities/win.entity';
import { Like } from '../../likes/entities/like.entity';
import { SocialLink } from '../../social-links/entities/social-link.entity';

export enum UserRole {
  CREATOR = 'creator',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'social_link', nullable: true })
  socialLink: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Roulette, roulette => roulette.creator)
  roulettes: Roulette[];

  @OneToMany(() => Win, win => win.user)
  wins: Win[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => SocialLink, socialLink => socialLink.user)
  socialLinks: SocialLink[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}