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

@Controller('club')
@UseGuards(AuthGuard())
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Get('/')
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
    @GetUser() user: User,
  ): Promise<Club> {
    return this.clubService.createClub(createClubDto, user);
  }

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
