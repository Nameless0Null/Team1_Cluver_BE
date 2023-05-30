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
import { ClubAttendance } from './club_attendance.entity';

@Entity()
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.attendances, { eager: false })
  user: User;

  @ManyToOne(
    () => ClubAttendance,
    (club_attendance) => club_attendance.attendances,
    { eager: true },
  )
  club_attendance: ClubAttendance;

  @ManyToOne(() => Club, (club) => club.attendances)
  club: Club;

  @Column()
  isChecked: boolean;
}
