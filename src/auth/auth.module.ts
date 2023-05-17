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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretkey',
      signOptions: {
        expiresIn: 60 * 60 * 24,
      },
    }),
    TypeOrmModule.forFeature([User, Manager]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // auth 모듈에서 사용하기 위함
  exports: [JwtStrategy, PassportModule], // 다른 모듈에서 사용하기 위함
})
export class AuthModule {}
