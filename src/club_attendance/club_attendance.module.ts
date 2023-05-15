import { Module } from '@nestjs/common';
import { ClubAttendanceController } from './club_attendance.controller';
import { ClubAttendanceService } from './club_attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/entity/attendance.entity';
import { ClubAttendance } from 'src/entity/club_attendance.entity';
import { Club } from 'src/entity/club.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, ClubAttendance, Club, User]), //
  ],
  controllers: [ClubAttendanceController],
  providers: [ClubAttendanceService],
})
export class ClubAttendanceModule {}
