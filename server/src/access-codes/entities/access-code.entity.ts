import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Roulette } from '../../roulettes/entities/roulette.entity';

@Entity('access_codes')
export class AccessCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({ name: 'spins_left' })
  spinsLeft: number;

  @Column({ name: 'total_spins' })
  totalSpins: number;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => Roulette, roulette => roulette.accessCodes)
  @JoinColumn({ name: 'roulette_id' })
  roulette: Roulette;

  @Column({ name: 'roulette_id' })
  rouletteId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}