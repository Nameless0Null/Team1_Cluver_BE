import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Manager } from './manager.entity';
import { Attendance } from 'src/entity/attendance.entity';
import { ClubAttendance } from './club_attendance.entity';
import { Post } from './post.entity';

@Entity()
export class Club extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  img: string;

  @Column({ default: true })
  club_code: string = '기본코드';

  @OneToMany(() => ClubAttendance, (club_attendance) => club_attendance.club, {
    eager: true,
  })
  club_attendances: ClubAttendance[];

  // 한사람당 동아리 무조건 하나
  // 동아리:유저 = 1:N
  @JoinTable()
  @ManyToMany((type) => User, (users) => users.clubs, { eager: true })
  users: User[];

  // 동아리 하나당 관리자 여럿
  // 한 사람이 동아리 여러개 관리할 수도
  @JoinTable()
  @ManyToMany((type) => Manager, (managers) => managers.clubs, { eager: false })
  managers: Manager[];

  // 게시물
  @OneToMany(() => Post, (post) => post.club, { eager: true })
  posts: Post[];

  @OneToMany(() => ClubAttendance, (club_attendance) => club_attendance.club)
  attendances: ClubAttendance[];
}
