import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubAttendanceService } from 'src/club_attendance/club_attendance.service';
import { Club } from 'src/entity/club.entity';
import { Post } from 'src/entity/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async 읽기({ clubId }) {
    const club = await this.clubRepository.findOne({ where: { id: clubId } });
    const posts = club.posts;
    return posts;
  }

  async 쓰기({ clubId, content }) {
    const club = await this.clubRepository.findOne({ where: { id: clubId } });
    const currentDate = new Date();
    const new_post = {
      club,
      content,
      date: currentDate,
    };
    return await this.postRepository.save(new_post);
  }
}
