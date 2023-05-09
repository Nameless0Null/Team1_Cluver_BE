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

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
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
    return found;
  }

  async createClub(createClubDto: CreateClubDto, user: User): Promise<Club> {
    const { title, description } = createClubDto;

    const club = { title, description, status: ClubStatus.PUBLIC, user };

    return await this.clubRepository.save(club);
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
