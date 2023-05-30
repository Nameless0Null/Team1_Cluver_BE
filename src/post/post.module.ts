import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';
import { ClubAttendanceService } from 'src/club_attendance/club_attendance.service';
import { Post } from 'src/entity/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, Post]), //
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
