import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Roulette } from '../../roulettes/entities/roulette.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Roulette, roulette => roulette.creator)
  roulettes: Roulette[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}