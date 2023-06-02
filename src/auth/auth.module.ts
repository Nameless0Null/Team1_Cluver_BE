import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { Manager } from 'src/entity/manager.entity';
import { ManagerService } from './manager.service';
import { ManagerRepository } from './repository/manager.repository';
import { ManagerAuthorityRepository } from './repository/manager-authority.repository';
import { TypeOrmExModule } from 'src/typeorm-ex.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretkey',
      signOptions: {
        expiresIn: 60 * 60 * 24,
      },
    }),
    TypeOrmExModule.forCustomRepository([User, Manager, ManagerRepository, ManagerAuthorityRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ManagerService], // auth 모듈에서 사용하기 위함
  exports: [TypeOrmExModule], // 다른 모듈에서 사용하기 위함
})
export class AuthModule {}
