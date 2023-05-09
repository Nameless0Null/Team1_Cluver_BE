import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClubStatus } from './club-status.enum';

@Entity()
export class Club extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ClubStatus;
}
