import { EntityRepository, Repository } from "typeorm";
import { Manager } from "../../entity/manager.entity";

@EntityRepository(Manager)
export class ManagerRepository extends Repository<Manager>{}