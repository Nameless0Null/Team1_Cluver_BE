import { Module } from '@nestjs/common';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubRepository } from './club.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClubRepository])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
