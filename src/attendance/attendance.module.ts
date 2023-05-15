import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Attendance } from '../entity/attendance.entity';
import { Club } from 'src/entity/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance, Club])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
