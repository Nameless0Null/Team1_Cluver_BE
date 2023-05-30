import { Module } from '@nestjs/common';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Manager } from 'src/entity/manager.entity';
import { User } from 'src/entity/user.entity';
import { Attendance } from 'src/entity/attendance.entity';
import { ClubAttendance } from 'src/entity/club_attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, Manager, User, Attendance, ClubAttendance]), //
    AuthModule,
  ],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
