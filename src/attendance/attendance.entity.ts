import { Club } from 'src/entity/club.entity';
import { User } from 'src/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  date: string;

  @ManyToOne(() => User, (user) => user.attendances, { eager: false })
  user: User;

  @ManyToOne(() => Club, (club) => club.attendances, { eager: false })
  club: Club;
}
