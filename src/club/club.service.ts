import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClubStatus } from './club-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateClubDto } from './dto/create-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Manager } from 'src/entity/manager.entity';
import { Attendance } from 'src/entity/attendance.entity';
import { ClubAttendance } from 'src/entity/club_attendance.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,

    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(ClubAttendance)
    private clubAttendanceRepository: Repository<ClubAttendance>,
  ) {}

  async getAllClubs(): Promise<Club[]> {
    const found = await this.clubRepository.find({ order: { name: 'ASC' } });
    const test = await this.attendanceRepository.find({ order: { id: 'ASC' } });

    for (const attendance of test) {
      console.log(attendance.club_attendance.date);
    }

    return found;
  }

  async getClubsByManager(manager: Manager): Promise<Club[]> {
    return manager.clubs;
  }

  async getClubById(id: number): Promise<Club> {
    const found = await this.clubRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new NotFoundException(`Can't found Club with id ${id}`);
    }

    // 동아리원 쭉 출력

    // const club = await this.clubRepository.findOne({
    //   relations: {
    //     users: true,
    //     attendances: true,
    //   },
    //   where: {
    //     users: {
    //       attendances: {
    //         club: {
    //           id: 1,
    //         },
    //       },
    //     },
    //   },
    //   order: {
    //     users: {
    //       id: 'ASC',
    //       attendances: {
    //         id: 'ASC',
    //       },
    //     },
    //   },
    // });

    const club = await this.clubRepository
      .createQueryBuilder('club')
      .leftJoinAndSelect('club.club_attendances', 'club_attendance')
      .leftJoinAndSelect('club.users', 'user')
      .leftJoinAndSelect('club.posts', 'post')
      .leftJoinAndSelect('user.attendances', 'attendance')
      .where('club.id = :clubId', { clubId: id })
      .andWhere('attendance.clubId = :clubId', { clubId: id }) // Filter attendances by clubId
      .orderBy('user.id', 'ASC')
      .addOrderBy('attendance.id', 'ASC')
      .addOrderBy('club_attendance.id', 'ASC')
      .getOne();

    return club;
  }

  async getClubsByName(name: string) {
    const clubs = await this.clubRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
    console.log('name : ', name);
    return clubs;
  }

  async createClub(
    createClubDto: CreateClubDto,
    manager: Manager,
  ): Promise<Club> {
    const { name, description, img, is_public, club_code } = createClubDto;
    const clubCode = club_code ? club_code : '기본코드';

    const club = {
      name,
      description,
      status: is_public ? ClubStatus.PUBLIC : ClubStatus.PRIVATE,
      img,
      club_code: clubCode,
    };

    // club Repository에 저장
    const saved_club = await this.clubRepository.save(club);

    // manager Repository에 저장
    manager.clubs.push(saved_club);

    console.log(manager.id, manager.manager_name);

    await this.managerRepository.save(manager);

    return saved_club;
  }

  async deleteClub(id: number, user: User): Promise<string> {
    const result = await this.clubRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Club with id ${id}`);
    } else if (result.affected === 1) {
      return '삭제 완료';
    }
  }

  async updateClub(createClubDto, id: number): Promise<Club> {
    const club = await this.getClubById(id);
    const { name, description, img, is_public, club_code } = createClubDto;

    club.name = name;
    club.description = description;
    club.img = img;
    club.club_code = club_code;
    club.status = is_public ? ClubStatus.PUBLIC : ClubStatus.PRIVATE;

    return await this.clubRepository.save(club);
  }
}
