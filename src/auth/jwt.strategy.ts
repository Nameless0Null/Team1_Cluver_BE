import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as config from 'config';
import { Manager } from 'src/entity/manager.entity';

const jwtConfig: any = config.get('jwt');
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {
    super({
      secretOrKey: jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { manager_name } = payload;
    const manager = await this.managerRepository.findOne({
      where: { manager_name },
    });

    if (!manager) {
      throw new UnauthorizedException();
    }

    return manager;
  }
}
