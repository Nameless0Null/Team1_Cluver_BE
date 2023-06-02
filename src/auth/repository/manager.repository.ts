import { EntityRepository, Repository } from "typeorm";
import { Manager } from "../../entity/manager.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";

@CustomRepository(Manager)
export class ManagerRepository extends Repository<Manager>{}