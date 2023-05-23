import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClubAttendanceService } from './club_attendance.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  clubId_date_Request,
  codeCheckRequest,
  doCheckRequest,
  doCheckResponse,
  startCheckRequest,
  startCheckResponse,
} from 'src/configs/swagger.config';
import { ClubAttendance } from 'src/entity/club_attendance.entity';
import { NotFoundError } from 'rxjs';

@ApiTags('출석')
@Controller('club-attendance')
export class ClubAttendanceController {
  constructor(
    private clubAttendanceService: ClubAttendanceService, //
  ) {}

  @ApiOperation({ summary: '출석 시작' })
  @ApiBody({
    description: '날짜형식은 띄어쓰기없이 한글로 n월n일',
    type: startCheckRequest,
  })
  @ApiCreatedResponse({
    description: '랜덤으로 생성된 출석코드',
    type: startCheckResponse,
  })
  @Post('/startcheck')
  async startCheck(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
    @Body('activity') activity: string,
  ): Promise<{ checkCode: string } | string> {
    const isAlready =
      await this.clubAttendanceService.getClubAttendanceByDateClubId({
        clubId,
        date,
      });
    if (isAlready)
      return `날짜 : ${date} / clubId : ${clubId}의 출석은 이미 진행됐음`;
    return this.clubAttendanceService.addClubAttendanceRow({
      date,
      clubId,
      activity,
    });
  }

  @ApiOperation({ summary: '출석 체크' })
  @ApiBody({
    description: '날짜형식은 띄어쓰기없이 한글로 n월n일',
    type: doCheckRequest,
  })
  @ApiCreatedResponse({
    description: '에러없으면 출석완료 / response.status===201이면 출석완료.',
    type: doCheckResponse,
  })
  @Post('/docheck')
  async doCheck(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
    @Body('username') username: string,
    @Body('usercode') usercode: string,
  ) {
    // 출석체크 경우의 수
    // 1. 아예 새로운 유저가 1번동아리 출석체크
    //// user 새로 추가 (addNewUser)
    //// attendance 전체 추가 / isChecked 반영
    //// club_attendance number 반영
    // 2. 2번 동아리 유저가, 1번동아리 새로 출석체크
    //// user 추가 (addExistingUser)
    //// attendance 전체 추가 / isChecked 반영
    //// club_attendance number 반영
    // 3. 기존 1번동아리 유저가, 1번동아리 출석체크
    //// attendance 한줄 추가 / isChecked 반영
    //// club_attendance number 반영

    const club = await this.clubAttendanceService.getClubById(clubId);
    const user = await this.clubAttendanceService.getUserByNameCode({
      username,
      usercode,
    });

    if (!club) throw new NotFoundException('해당 클럽은 없음');
    if (!user) {
      const saved_user = await this.clubAttendanceService.addNewUser({
        username,
        usercode,
        club,
      });
      await this.clubAttendanceService.addAttendances({
        club,
        user: saved_user,
        date,
      });
      await this.clubAttendanceService.checkNum반영({ club, date });
    } else {
      // 유저는 있는데 다른 동아리 유저일때
      if (!(await this.clubAttendanceService.checkClubUser({ user, club }))) {
        const saved_user = await this.clubAttendanceService.addExistingUser({
          user,
          club,
        });
        await this.clubAttendanceService.addAttendances({
          club,
          user: saved_user,
          date,
        });
        await this.clubAttendanceService.checkTrue({ date, clubId, user });
        await this.clubAttendanceService.checkNum반영({ club, date });
      }
      // 기존 동아리 유저일때
      else if (await this.clubAttendanceService.checkClubUser({ user, club })) {
        console.log('기존 동아리 유저일 때 물림');
        await this.clubAttendanceService.checkTrue({ date, clubId, user });
        console.log('1');
        await this.clubAttendanceService.checkNum반영({ club, date });
        console.log('2');
      }
    }
  }

  @ApiOperation({ summary: '코드 체크' })
  @ApiBody({
    description: '출석코드 체크',
    type: codeCheckRequest,
  })
  @ApiCreatedResponse({
    description:
      '상황별로 텍스트로 다옴 -  출석체크 이미 끝났을 때, 출석코드 다를때, 출석 성공했을 때',
    type: String,
  })
  @Post('/codecheck')
  코드체크(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
    @Body('code') code: string,
  ) {
    return this.clubAttendanceService.코드체크({ date, clubId, code });
  }

  @ApiOperation({ summary: '출석 마감' })
  @ApiBody({
    description: 'club_attendance의 isValid를 false로 바꿈.',
    type: clubId_date_Request,
  })
  @ApiCreatedResponse({
    description: '마감시킨 club_attendance 정보 반환',
    type: ClubAttendance,
  })
  @Post('/end')
  출석마감(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
  ) {
    return this.clubAttendanceService.마감({ date, clubId });
  }

  @ApiOperation({ summary: '출석 마감한거 다시 유효하게' })
  @ApiBody({
    description: 'club_attendance의 isValid를 true로 바꿈.',
    type: clubId_date_Request,
  })
  @ApiCreatedResponse({
    description: '다시 유효하게 만든 club_attendance 정보 반환',
    type: ClubAttendance,
  })
  @Post('/restart')
  출석다시시작(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
  ) {
    return this.clubAttendanceService.다시시작({ date, clubId });
  }

  @ApiOperation({ summary: '조회' })
  @ApiBody({
    description: 'club_attendance를 조회함',
    type: clubId_date_Request,
  })
  @ApiCreatedResponse({
    description:
      '상황별로 텍스트로 옴. 만약에 출석진행중이면 해당 club_attendance 반환',
    type: ClubAttendance,
  })
  @Post('/')
  async 조회(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
    @Res() res,
  ) {
    const result = await this.clubAttendanceService.조회({ date, clubId });
    if (result === null) {
      // 출석코드 없음
      res.status(201).send('출석코드 없음');
    } else if (result) {
      // 출석 진행중.
      // 해당 club_attendance 조회
      res.status(200).send(result);
    }
  }

  @Post('/calendar')
  async calendar(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
    @Req() request,
  ) {
    return this.clubAttendanceService.그날출석한유저리스트({ date, clubId });
  }
}
