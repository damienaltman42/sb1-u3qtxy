import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AccessCode } from '../../access-codes/entities/access-code.entity';
import { Win } from '../../wins/entities/win.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity('roulettes')
export class Roulette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  items: string;

  @Column({ type: 'text' })
  packages: string;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => User, user => user.roulettes)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @OneToMany(() => AccessCode, code => code.roulette)
  accessCodes: AccessCode[];

  @OneToMany(() => Win, win => win.roulette)
  wins: Win[];

  @OneToMany(() => Like, like => like.roulette)
  likedBy: Like[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get itemsJson(): any[] {
    return JSON.parse(this.items);
  }

  set itemsJson(value: any[]) {
    this.items = JSON.stringify(value);
  }

  get packagesJson(): any[] {
    return JSON.parse(this.packages);
  }

  set packagesJson(value: any[]) {
    this.packages = JSON.stringify(value);
  }
}