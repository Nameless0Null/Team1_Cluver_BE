import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entity/attendance.entity';
import { Club } from 'src/entity/club.entity';
import { ClubAttendance } from 'src/entity/club_attendance.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubAttendanceService {
  constructor(
    @InjectRepository(ClubAttendance)
    private club_attendanceRepository: Repository<ClubAttendance>,

    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(Club)
    private clubRepository: Repository<Club>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getRandomCode() {
    const min = 0; // 최소값
    const max = 9999; // 최대값
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const paddedNumber = randomNumber.toString().padStart(4, '0');
    return paddedNumber;
  }

  async getClubById(clubId: number): Promise<Club> {
    return await this.clubRepository.findOne({ where: { id: clubId } });
  }

  async getUserByNameCode({ username, usercode }) {
    const user = await this.userRepository.findOne({
      where: { user_name: username, code: usercode },
    });
    if (!user) return false;
    else return user;
  }

  async addClubAttendanceRow({ date, clubId }): Promise<{ checkCode: string }> {
    const checkCode = this.getRandomCode();

    // club_attendance
    const club = await this.getClubById(clubId);
    const totalNum = club.users.length;
    const newRow = { date, totalNum, checkNum: 0, checkCode, club };
    const result_club_attendance = await this.club_attendanceRepository.save(
      newRow,
    );

    // attendance
    const users = club.users;

    users.forEach(async (user) => {
      const newRow_attendance = {
        isChecked: false,
        user,
        club_attendance: result_club_attendance,
      };
      await this.attendanceRepository.save(newRow_attendance);
    });
    return { checkCode };
  }

  async checkCode({ clubId, date, code }) {
    const club = await this.getClubById(clubId);
    let now_club_attendance;

    console.log(club.club_attendances);
    club.club_attendances.forEach(async (each) => {
      console.log('each : ', each);
      if (each.date === date) {
        now_club_attendance = each;
      }
    });

    if (!now_club_attendance) {
      throw new BadRequestException('해당 날짜의 출석체크는 없음.');
    }

    if (now_club_attendance.checkCode === code) {
      return true;
    } else {
      return false;
    }
  }

  async addCheckNum({ date, clubId, username, usercode }) {
    const club = await this.getClubById(clubId);
    let now_club_attendance;

    // club_attendance
    // checkNum + 1
    const club_attendance_array = club.club_attendances;
    club_attendance_array.forEach(async (each) => {
      if (each.date === date) {
        each.checkNum++;
        now_club_attendance = each;
        await this.club_attendanceRepository.save(each);
      }
    });

    // attendance
    // isChecked true 수정
    const user = await this.userRepository.findOne({
      where: { user_name: username, code: usercode },
    });
    user.attendances.forEach(async (user_attendance) => {
      if (user_attendance.club_attendance.id === now_club_attendance.id) {
        user_attendance.isChecked = true;
        await this.attendanceRepository.save(user_attendance);
      }
    });
  }

  // 새로운 유저
  async addUser({ username, usercode, clubId }) {
    const club = await this.getClubById(clubId);
    const newUser = { user_name: username, code: usercode, club };
    return await this.userRepository.save(newUser);
  }

  async addAttendances({ clubId, user, date }) {
    const club = await this.getClubById(clubId);
    const club_attendances = club.club_attendances;

    club_attendances.forEach(async (club_attendance) => {
      if (club_attendance.date === date) {
        const newRow_attendance = {
          isChecked: true,
          user,
          club_attendance,
        };
        await this.attendanceRepository.save(newRow_attendance);
        club_attendance.totalNum++;
        club_attendance.checkNum++;
        await this.club_attendanceRepository.save(club_attendance);
      } else {
        const newRow_attendance = {
          isChecked: false,
          user,
          club_attendance,
        };
        await this.attendanceRepository.save(newRow_attendance);
      }
    });
  }
}
