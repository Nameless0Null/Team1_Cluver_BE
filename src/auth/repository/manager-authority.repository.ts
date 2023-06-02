import { EntityRepository, Repository } from "typeorm";
import { ManagerAuthority } from "../../entity/manager-authority.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";

@CustomRepository(ManagerAuthority)
export class ManagerAuthorityRepository extends Repository<ManagerAuthority> {}