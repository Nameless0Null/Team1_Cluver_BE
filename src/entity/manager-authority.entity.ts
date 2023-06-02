import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Manager } from "./manager.entity";

@Entity('manager_authority')
export class ManagerAuthority {
    @PrimaryColumn()
    id: number;

    @Column('int',{name: 'manager_id'})
    managerId: number;

    @Column('varchar',{name: 'authority_name'})
    authorityName: string;

    @ManyToOne(type=>Manager, manager=>manager.clubs)
    @JoinColumn({name: 'manager_id'})
    manager: Manager;
  static manager: any;
}