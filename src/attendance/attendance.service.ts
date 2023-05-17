import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from '../entity/attendance.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Club } from 'src/entity/club.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(Club)
    private clubRepository: Repository<Club>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkAttendance(
    date: string,
    username: string,
    clubname: string,
    code: string,
  ): Promise<Attendance> {
    const club = await this.clubRepository.findOne({
      where: { name: clubname },
    });
    let user = await this.userRepository.findOne({
      where: { user_name: username },
    });

    if (!user) {
      user = await this.userRepository.save({
        user_name: username,
        code,
        club,
      });
    }

    const attendance = { date, user, club };

    return await this.attendanceRepository.save(attendance);
  }

  async getAllAttendances(): Promise<Attendance[]> {
    return await this.attendanceRepository.find();
  }
}
