import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Club } from './club.entity';

@Entity()
@Unique(['manager_id', 'manager_email'])
export class Manager extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manager_id: string;

  @Column()
  manager_password: string;

  @Column()
  manager_email: string;

  @Column()
  manager_name: string;

  // eager 설정은, 이거 조회할 때 조인된 녀석들도 가져올지 말지 결정
  @ManyToOne((type) => Club, (club) => club.managers, { eager: false })
  club: Club;
}
