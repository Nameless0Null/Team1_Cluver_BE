import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  admin: string;
}
