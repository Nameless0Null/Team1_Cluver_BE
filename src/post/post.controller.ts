import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { clubId, postWrite } from 'src/configs/swagger.config';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService, //
  ) {}

  @ApiOperation({ summary: '글 불러오기' })
  @ApiBody({
    description:
      '사실 글 불러오기는 필요없음. club 불러오면 그 안에 다 있음. 다만 페이지별로 api 분리하고 싶으면 이거 쓰면 됨',
    type: clubId,
  })
  @Post('/read')
  글읽기(
    @Body('clubId') clubId: number, //
  ) {
    return this.postService.읽기({ clubId });
  }

  @Post('/write')
  @ApiOperation({ summary: '글 쓰기' })
  @ApiBody({
    type: postWrite,
  })
  글쓰기(
    @Body('clubId') clubId: number, //
    @Body('content') content: string, //
  ) {
    return this.postService.쓰기({ clubId, content });
  }
}
