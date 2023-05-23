import { Module } from '@nestjs/common';
import { ClubModule } from './club/club.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfigAsync } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from 'config/config.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ClubAttendanceModule } from './club_attendance/club_attendance.module';
import { EmailModule } from './email/email.module';
import { TestModule } from './test/test.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigurationModule,
    ClubModule,
    AuthModule,
    AttendanceModule,
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ClubAttendanceModule,
    EmailModule,
    TestModule,
    PostModule,
    // TypeOrmModule.forRoot(typeORMConfigAsync), //
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
