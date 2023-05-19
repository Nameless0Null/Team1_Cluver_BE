import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError, throwError } from 'rxjs';
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
    const club = await this.clubRepository.findOne({ where: { id: clubId } });
    if (!club) {
      throw new BadRequestException(`${clubId}의 clubId를 가지는 클럽은 없음`);
    }
    return club;
  }

  async getUserByNameCode({ username, usercode }) {
    const user = await this.userRepository.findOne({
      where: { user_name: username, code: usercode },
    });
    if (!user) return false;
    else return user;
  }

  async addClubAttendanceRow({
    date,
    clubId,
    activity,
  }): Promise<{ checkCode: string }> {
    const checkCode = this.getRandomCode();

    // club_attendance
    const club = await this.getClubById(clubId);
    const totalNum = club.users.length;
    const newRow = { date, totalNum, checkNum: 0, checkCode, club, activity };
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
    let now_club_attendance: ClubAttendance | undefined;

    for (const each of club.club_attendances) {
      if (each.date === date) {
        now_club_attendance = each;
        break;
      }
    }

    if (!now_club_attendance) {
      throw new BadRequestException('해당 날짜의 출석체크는 없음.');
    }

    return now_club_attendance.checkCode === code;
  }

  async getClubAttendanceByDateClubId({ clubId, date }) {
    const club = await this.getClubById(clubId);
    let now_club_attendance: ClubAttendance | undefined;

    for (const each of club.club_attendances) {
      if (each.date === date) {
        each.checkNum++;
        now_club_attendance = each;
        await this.club_attendanceRepository.save(each);
        break;
      }
    }
    return now_club_attendance;
  }

  async addCheckNum({ date, clubId, username, usercode }) {
    // club_attendance
    // checkNum + 1
    const club_attendance = await this.getClubAttendanceByDateClubId({
      clubId,
      date,
    });
    club_attendance.checkNum++;
    await this.club_attendanceRepository.save(club_attendance);

    // attendance
    // isChecked true 수정
    const user = await this.userRepository.findOne({
      where: { user_name: username, code: usercode },
    });

    for (const userAttendance of user.attendances) {
      if (userAttendance.club_attendance.id === club_attendance.id) {
        userAttendance.isChecked = true;
        await this.attendanceRepository.save(userAttendance);
      }
    }
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

  async 조회({ date, clubId }) {
    const club = await this.getClubById(clubId);
    let result_club_attendance = null;
    const club_attendances = club.club_attendances;
    club_attendances.forEach((each_club_attendance) => {
      if (each_club_attendance.date === date) {
        result_club_attendance = each_club_attendance;
      }
    });

    return result_club_attendance;
  }

  async 마감({ date, clubId }) {
    const club = await this.getClubById(clubId);
    let result_club_attendance = null;
    const club_attendances = club.club_attendances;
    club_attendances.forEach((each_club_attendance) => {
      if (each_club_attendance.date === date) {
        result_club_attendance = each_club_attendance;
      }
    });
    result_club_attendance.isValid = 0;
    await this.club_attendanceRepository.save(result_club_attendance);

    return result_club_attendance;
  }

  async 코드체크({ date, clubId, code }) {
    const club_attendance = await this.조회({ clubId, date });
    if (!club_attendance) {
      throw new BadRequestException('해당 club_attendance 없음');
    }
    if (!club_attendance.isValid) {
      return '출석체크 이미 끝났음';
    }
    if (club_attendance.checkCode !== code) {
      return '출석코드가 다름';
    }
    return '출석 성공';
  }

  async 그날출석한유저리스트({ date, clubId }) {
    const club = await this.getClubById(clubId);

    const club_attendance = await this.조회({ date, clubId });
    if (!club_attendance)
      throw new NotFoundException('해당 club_attendance 없음');

    const attendance_array = await this.attendanceRepository.find({
      where: { club_attendance },
    });
    const user_array = club.users;

    const attendance_id_array = [];
    for (const each of attendance_array) {
      attendance_id_array.push(each.id);
    }

    const result = [];

    for (const user of user_array) {
      for (const attendance of user.attendances) {
        if (attendance_id_array.includes(attendance.id)) {
          result.push({
            name: user.user_name,
            code: user.code,
            isChecked: attendance.isChecked,
          });
          break;
        }
      }
    }

    return result;
    // const result = [];

    // user_array.forEach((element) => {
    //   if (user_id_array.includes(element.id)) {
    //     const username = element.user_name;
    //     const usercode = element.code;
    //     result.push({ username, usercode });
    //   }
    // });

    // return result;

    // for -> user array
    //   for -> user_array.attendance
    //     attendance.id in attendance_array
    //       result 에 user_id, user_code 추가
  }
}
