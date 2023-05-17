import { Club } from 'src/entity/club.entity';
import { User } from 'src/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity()
export class ClubAttendance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  date: string;

  @Column()
  activity: string;

  @Column()
  totalNum: number;

  @Column()
  checkNum: number;

  @Column()
  checkCode: string;

  @Column({ default: true })
  isValid: boolean = true;

  @OneToMany(() => Attendance, (attendance) => attendance.club_attendance, {
    eager: false,
  })
  attendances: Attendance[];

  @ManyToOne(() => Club, (club) => club.club_attendances, { eager: false })
  club: Club;

  //   @ManyToMany(() => User, (user) => user.club_attendances, { eager: false })
  //   users: User[];

  //실행
}
