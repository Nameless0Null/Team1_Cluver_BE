import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  isChecked: boolean;
}
