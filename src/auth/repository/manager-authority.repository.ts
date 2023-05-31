import { EntityRepository, Repository } from "typeorm";
import { ManagerAuthority } from "../../entity/manager-authority.entity";

@EntityRepository(ManagerAuthority)
export class ManagerAuthorityRepository extends Repository<ManagerAuthority> {}