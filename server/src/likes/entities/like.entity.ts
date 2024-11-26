import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Roulette } from '../../roulettes/entities/roulette.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Roulette, roulette => roulette.likedBy)
  @JoinColumn({ name: 'roulette_id' })
  roulette: Roulette;

  @Column({ name: 'roulette_id' })
  rouletteId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}