import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { Manager } from 'src/entity/manager.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {
    super({
      secretOrKey: 'secretkey',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { name } = payload;
    const manager = await this.managerRepository.findOne({
      where: { manager_name: name },
    });

    if (!manager) {
      throw new UnauthorizedException('토큰이 유효하지 않음');
    }
    return manager;
  }
}
