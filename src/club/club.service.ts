import { Injectable, NotFoundException } from '@nestjs/common';
import { ClubStatus } from './club-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateClubDto } from './dto/create-club.dto';

@Injectable()
export class ClubService {
  private clubs: Club[] = [];

  getAllClubs(): Club[] {
    return this.clubs;
  }

  createClub(createClubDto: CreateClubDto) {
    const { title, description } = createClubDto;
    const club: Club = {
      id: uuid(),
      title,
      description,
      status: ClubStatus.PUBLIC,
    };

    this.clubs.push(club);
    return club;
  }

  getClubById(id: string): Club {
    const found = this.clubs.find((club) => club.id === id);

    if (!found) {
      throw new NotFoundException(`${id}의 클럽을 찾을 수 없다`);
    }

    return found;
  }

  deleteClub(id: string): void {
    const found = this.getClubById(id);
    this.clubs = this.clubs.filter((club) => club.id !== found.id);
  }

  updateClubStatus(id: string, status: ClubStatus): Club {
    const club = this.getClubById(id);
    club.status = status;
    return club;
  }
}
