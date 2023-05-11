import { Module } from '@nestjs/common';
import { ClubModule } from './club/club.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfigAsync } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from 'config/config.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeORMConfigAsync), //
    ConfigurationModule,
    ClubModule,
    AuthModule,
    AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
