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
  Unique,
} from 'typeorm';
import { Club } from './club.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['manager_id', 'manager_email'])
export class Manager extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'pid' })
  id: number;

  @Column()
  @ApiProperty({ description: '아이디' })
  manager_id: string;

  @Column()
  @Exclude()
  manager_password: string;

  @Column()
  @ApiProperty({ description: '이메일' })
  manager_email: string;

  @Column()
  @ApiProperty({ description: '이름' })
  manager_name: string;

  // eager 설정은, 이거 조회할 때 조인된 녀석들도 가져올지 말지 결정

  @ManyToMany((type) => Club, (clubs) => clubs.managers, { eager: true })
  clubs: Club[];
}
