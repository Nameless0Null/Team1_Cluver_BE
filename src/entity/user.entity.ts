import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Club } from './club.entity';
import { Attendance } from 'src/attendance/attendance.entity';

@Entity()
// @Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  code: string;

  // eager 설정은, 이거 조회할 때 조인된 녀석들도 가져올지 말지 결정
  @ManyToOne((type) => Club, (club) => club.users, { eager: false })
  club: Club;

  @OneToMany(() => Attendance, (attendance) => attendance.user, {
    eager: true,
  })
  attendances: Attendance[];
}
