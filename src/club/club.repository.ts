import { Repository } from 'typeorm';
import { ClubModule } from './club.module';
import { Club } from './club.entity';

export class ClubRepository extends Repository<Club> {}
