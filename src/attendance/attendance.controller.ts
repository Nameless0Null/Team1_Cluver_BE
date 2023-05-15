import { Body, Controller, Get, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Attendance } from '../entity/attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/')
  AddAttendance(
    @Body('date') date: string, //
    @Body('username') username: string,
    @Body('clubname') clubname: string,
    @Body('code') code: string,
  ) {
    return this.attendanceService.checkAttendance(
      date,
      username,
      clubname,
      code,
    );
  }

  @Get('/')
  @ApiOperation({
    summary: 'attendance 전체 조회',
    description: 'attendance 전체 조회',
  })
  @ApiCreatedResponse({
    description: '전체 attendance',
    type: Promise<Attendance[]>,
  })
  async GetAllAttendances() {
    return this.attendanceService.getAllAttendances();
  }
}
