import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Manager } from './manager.entity';
import { Attendance } from 'src/attendance/attendance.entity';

@Entity()
export class Club extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  img: string;

  // 한사람당 동아리 무조건 하나
  // 동아리:유저 = 1:N
  @OneToMany((type) => User, (user) => user.club, { eager: true })
  users: User[];

  // 관리자는 여럿
  // 동아리:매니저 = 1:N
  @OneToMany((type) => Manager, (manager) => manager.club, { eager: true })
  managers: Manager[];

  // 출석
  @OneToMany(() => Attendance, (attendance) => attendance.club, { eager: true })
  attendances: Attendance[];
}
