import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('club')
@UseGuards(AuthGuard())
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Get('/')
  @ApiOperation({
    summary: '동아리 전체 조회',
    description: '동아리 전체 조회',
  })
  @ApiCreatedResponse({ description: '전체 동아리', type: Promise<Club[]> })
  getAllClubs(): Promise<Club[]> {
    return this.clubService.getAllClubs();
  }

  @Get('/my')
  getClubsByUser(
    @GetUser() user: User, //
  ): Promise<Club[]> {
    return this.clubService.getClubsByUser(user);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createClub(
    @Body() createClubDto: CreateClubDto, //
    @GetUser() manager: Manager,
  ): Promise<Club> {
    return this.clubService.createClub(createClubDto, manager);
  }

  // 해당 클럽 조회
  // 동아리원 쭉 출력
  // 동아리원 별로 이름 + 유저코드 + 출석배열 출력되게
  @Get('/:id')
  getClubById(
    @Param('id') id: number, //
  ): Promise<Club> {
    return this.clubService.getClubById(id);
  }

  @Delete('/:id')
  deleteClub(
    @Param('id', ParseIntPipe) id: number, //
    @GetUser() user: User,
  ): Promise<string> {
    return this.clubService.deleteClub(id, user);
  }

  @Patch('/:id/status')
  updateClubStatus(
    @Param('id') id: number,
    @Body('status', ClubStatusValidationPipe) status: ClubStatus,
  ): Promise<Club> {
    return this.clubService.updateClubStatus(id, status);
  }
}
