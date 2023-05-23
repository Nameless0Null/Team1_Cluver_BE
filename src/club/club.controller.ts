import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubStatus } from './club-status.enum';
import { CreateClubDto } from './dto/create-club.dto';
import { ClubStatusValidationPipe } from './pipe/club-status-validation.pipe';
import { Club } from 'src/entity/club.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { Manager } from 'src/entity/manager.entity';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import * as swagger from '../configs/swagger.config';

@ApiTags('club')
@Controller()
// @UseGuards(AuthGuard())
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Get('/test')
  @UseGuards(AuthGuard())
  Test(
    @GetUser() manager: Manager, //
  ) {
    return manager;
  }

  @Get('club')
  @ApiOperation({ summary: '동아리 전체 조회' })
  @ApiCreatedResponse({ type: swagger.clubsResponse })
  getAllClubs(): Promise<Club[]> {
    return this.clubService.getAllClubs();
  }

  @Get('club/my')
  @UseGuards(AuthGuard())
  getClubsByUser(
    @GetUser() manager: Manager, //
  ): Promise<Club[]> {
    return this.clubService.getClubsByManager(manager);
  }

  @ApiOperation({ summary: '동아리 만들기' })
  @ApiBody({
    description:
      'club_code는 안넣어도 됨. 안넣으면 club_code가 기본코드로 들어감',
    type: swagger.createClubRequest,
  })
  @Post('club')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  createClub(
    @Body() createClubDto: CreateClubDto, //
    @GetUser() manager: Manager,
  ): Promise<Club> {
    return this.clubService.createClub(createClubDto, manager);
  }

  // 해당 클럽 조회
  // 동아리원 쭉 출력
  // 동아리원 별로 이름 + 유저코드 + 출석배열 출력되게
  @Get('club/:id')
  getClubById(
    @Param('id') id: number, //
  ): Promise<Club> {
    return this.clubService.getClubById(id);
  }

  @ApiOperation({
    summary: `axios.get('주소:8000/search?name=검색어') 형태로 넣으면 됩니다`,
  })
  @Get('search')
  async getClubsByName(
    @Query('name') name: string, //
  ) {
    return await this.clubService.getClubsByName(name);
  }

  @Delete('club/:id')
  deleteClub(
    @Param('id', ParseIntPipe) id: number, //
    @GetUser() user: User,
  ): Promise<string> {
    return this.clubService.deleteClub(id, user);
  }

  @ApiOperation({ summary: '동아리 수정' })
  @ApiBody({
    description:
      'club_code는 안넣어도 됨. 안넣으면 club_code가 기본코드로 들어감',
    type: swagger.createClubRequest,
  })
  @Patch('club/:id')
  updateClub(
    @Param('id') id: number,
    @Body() createClubDto: CreateClubDto, //
  ): Promise<Club> {
    return this.clubService.updateClub(createClubDto, id);
  }
}
