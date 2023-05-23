import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]), //
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
