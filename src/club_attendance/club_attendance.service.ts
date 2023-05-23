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

    for (const each of club.club_attendances) {
      if (each.date === date) {
        return each;
      }
    }
  }

  async 출석했는지체크({ date, username, usercode, clubId }): Promise<boolean> {
    let isAlreadyFlag = false;

    const club = await this.getClubById(clubId);

    const user = await this.userRepository.findOne({
      where: { user_name: username, code: usercode },
    });

    console.log(user);

    for (const userAttendance of user.attendances) {
      if (
        userAttendance.club_attendance.date === date &&
        userAttendance.club_attendance.club.id === clubId
      ) {
        isAlreadyFlag = userAttendance.isChecked;
        break;
      }
    }
    return isAlreadyFlag;
  }

  async checkTrue({ date, clubId, user }) {
    // attendance
    // isChecked true 수정
    const club_attendance = await this.getClubAttendanceByDateClubId({
      clubId,
      date,
    });
    for (const userAttendance of user.attendances) {
      if (userAttendance.club_attendance.id === club_attendance.id) {
        userAttendance.isChecked = true;
        await this.attendanceRepository.save(userAttendance);
        break;
      }
    }
  }

  ///////////////// 유저추가부분

  // 클럽에 해당유저가 가입되어있으면 true
  // 아니면 false
  async checkClubUser({ user, club }): Promise<boolean> {
    const club_user_ids = [];
    club.users.map((eachUser) => {
      club_user_ids.push(eachUser.id);
    });

    if (club_user_ids.includes(user.id)) {
      return true;
    }
    return false;
  }

  // user가 있으면
  //
  async addExistingUser({ user, club }) {
    const saved_user = user;

    // club Repository에 저장
    club.users.push(saved_user);
    const saved_club = await this.clubRepository.save(club);

    // totalNum 반영
    await this.totalNum반영({ club: saved_club });

    return user;
  }

  // 새로운 유저
  async addNewUser({ username, usercode, club }) {
    // user Repository에 저장
    const newUser = { user_name: username, code: usercode };
    const saved_user = await this.userRepository.save(newUser);

    // club Repository에 저장
    club.users.push(saved_user);
    const saved_club = await this.clubRepository.save(club);

    // totalNum 반영
    await this.totalNum반영({ club: saved_club });

    return saved_user;
  }

  async totalNum반영({ club }) {
    // club_attendance의 totalNum 수정
    const users = club.users;
    const totalNum = users.length;

    const club_attendances = club.club_attendances;
    for (const club_attendance of club_attendances) {
      club_attendance.totalNum = totalNum;
      await this.club_attendanceRepository.save(club_attendance);
    }
  }

  async checkNum반영({ club, date }) {
    // club_attendance 집어오기
    const club_attendances = club.club_attendances;
    let club_attendance;
    for (const each of club_attendances) {
      if (each.date === date) {
        club_attendance = each;
        break;
      }
    }

    // attendance 테이블에서, club_attendance id인 놈들 집어오기
    // attendance에서 isChecked 갯수 세기
    let checkNum = 0;
    const attendances = await this.attendanceRepository.find({
      where: { club_attendance },
    });
    for (const each of attendances) {
      if (each.isChecked) checkNum++;
    }
    club_attendance.checkNum = checkNum;

    // club_attendance 레포지토리에 저장
    await this.club_attendanceRepository.save(club_attendance);
  }

  async addAttendances({ club, user, date }) {
    const club_attendances = club.club_attendances;
    let now_club_attendance;

    // attendance 싹 박기
    for (const club_attendance of club_attendances) {
      if (club_attendance.date === date) {
        now_club_attendance = club_attendance;
      }
      const new_attendance = { isChecked: false, user, club_attendance };
      await this.attendanceRepository.save(new_attendance);
    }

    // attendance 중에 출석누른거 isChecked true로 바꾸기.
    const saved_user = await this.userRepository.findOne({
      where: { id: user.id },
    });
    const attendances = saved_user.attendances;
    for (const attendance of attendances) {
      if (attendance.club_attendance.id === now_club_attendance.id) {
        attendance.isChecked = true;
        await this.attendanceRepository.save(attendance);
        break;
      }
    }
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

  async 다시시작({ date, clubId }) {
    const club = await this.getClubById(clubId);
    let result_club_attendance = null;
    const club_attendances = club.club_attendances;
    club_attendances.forEach((each_club_attendance) => {
      if (each_club_attendance.date === date) {
        result_club_attendance = each_club_attendance;
      }
    });
    result_club_attendance.isValid = true;
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
  }
}
