import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Roulette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  accessCode: string;

  @Column('json')
  items: Array<{
    id: string;
    text: string;
    color: string;
    probability: number;
  }>;

  @ManyToOne(() => User, user => user.roulettes)
  creator: User;

  @Column()
  creatorId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}