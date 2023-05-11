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
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Manager } from 'src/entity/manager.entity';
import { Attendance } from 'src/attendance/attendance.entity';

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
  ) {}

  async getAllClubs(): Promise<Club[]> {
    const found = await this.clubRepository.find();
    return found;
  }

  async getClubsByUser(user: User): Promise<Club[]> {
    const query = this.clubRepository.createQueryBuilder('club');
    query.where('club.userId = :userId', { userId: user.id });
    const clubs = await query.getMany();
    return clubs;
  }

  async getClubById(id: number): Promise<Club> {
    const found = await this.clubRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Can't found Club with id ${id}`);
    }

    // 동아리원 쭉 출력
    const users: User[] = found.users;
    console.log('users : ', users);
    users.forEach((user) => {
      console.log('user.attendances : ', user.attendances);
    });

    // 동아리원 별로 이름 + 유저코드 + 출석배열 출력되게

    return found;
  }

  async createClub(
    createClubDto: CreateClubDto,
    manager: Manager,
  ): Promise<Club> {
    const { name, description, img } = createClubDto;
    const club = { name, description, status: ClubStatus.PUBLIC, img };

    // club Repository에 저장
    const saved_club = await this.clubRepository.save(club);

    // manager Repository에 저장
    await this.managerRepository.save({ ...manager, club: saved_club });
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

  async updateClubStatus(id: number, status: ClubStatus): Promise<Club> {
    const club = await this.getClubById(id);

    club.status = status;
    await this.clubRepository.save(club);

    return club;
  }
}
