import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Roulette } from '../../roulettes/entities/roulette.entity';

@Entity('wins')
export class Win {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.wins)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Roulette, roulette => roulette.wins)
  @JoinColumn({ name: 'roulette_id' })
  roulette: Roulette;

  @Column({ name: 'roulette_id' })
  rouletteId: string;

  @Column({ type: 'text' })
  prize: string;

  @Column({ default: false })
  claimed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  get prizeJson(): any {
    return JSON.parse(this.prize);
  }

  set prizeJson(value: any) {
    this.prize = JSON.stringify(value);
  }
}