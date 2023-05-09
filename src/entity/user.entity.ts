import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Club } from './club.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // eager 설정은, 이거 조회할 때 조인된 녀석들도 가져올지 말지 결정
  @OneToMany((type) => Club, (club) => club.user, { eager: true })
  clubs: Club[];
}
