import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { ManagerRepository } from "./repository/manager.repository";


import * as bcrypt from 'bcrypt';
import { Manager } from "../entity/manager.entity";

@Injectable()
export class ManagerService {

    constructor(
        @InjectRepository(ManagerRepository)
        private managerRepository: ManagerRepository
    ){}

    async transformPassword(manager: LoginDto): Promise<void> {
        manager.manager_password = await bcrypt.hash(
            manager.manager_password, 10,
        );
        return Promise.resolve();
    }
    
    async findByFields(options: FindOneOptions<LoginDto>): Promise<Manager | undefined> {
        return await this.managerRepository.findOne(options);
    }

    async save(loginDTO: LoginDto): Promise<LoginDto | undefined> {
        await this.transformPassword(loginDTO);
        console.log(loginDTO);
        return await this.managerRepository.save(loginDTO);
    }
}