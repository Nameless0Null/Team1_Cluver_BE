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
} from '@nestjs/common';
import { ClubService } from './club.service';
import { Club, ClubStatus } from './club-status.enum';
import { CreateClubDto } from './dto/create-club.dto';
import { ClubStatusValidationPipe } from './pipe/club-status-validation.pipe';

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Get('/')
  getAllClubs(): Club[] {
    return this.clubService.getAllClubs();
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createClub(
    @Body() createClubDto: CreateClubDto, //
  ): Club {
    return this.clubService.createClub(createClubDto);
  }

  @Get('/:id')
  getClubById(
    @Param('id') id: string, //
  ): Club {
    return this.clubService.getClubById(id);
  }

  @Delete('/:id')
  deleteClub(
    @Param('id') id: string, //
  ): void {
    this.clubService.deleteClub(id);
  }

  @Patch('/:id/status')
  updateClubStatus(
    @Param('id') id: string,
    @Body('status', ClubStatusValidationPipe) status: ClubStatus,
  ) {
    return this.clubService.updateClubStatus(id, status);
  }
}
