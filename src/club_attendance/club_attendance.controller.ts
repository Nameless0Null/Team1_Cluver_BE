import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClubAttendanceService } from './club_attendance.service';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  clubId_date_Request,
  codeCheckRequest,
  doCheckRequest,
  doCheckResponse,
  startCheckRequest,
  startCheckResponse,
} from 'src/configs/swagger.config';
import { ClubAttendance } from 'src/entity/club_attendance.entity';

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
  startCheck(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
    @Body('activity') activity: string,
  ): Promise<{ checkCode: string }> {
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
    // @Body('code') code: string,
  ) {
    const isUser = await this.clubAttendanceService.getUserByNameCode({
      username,
      usercode,
    });

    // 기존에 있던 유저가 출석체크 한거면
    if (isUser) {
      await this.clubAttendanceService.addCheckNum({
        date,
        clubId,
        username,
        usercode,
      });
    }
    // 기존에 없던 유저인 경우
    else {
      // user
      // 이름, 코드, 클럽 추가
      //
      const newUser = await this.clubAttendanceService.addUser({
        username,
        usercode,
        clubId,
      });
      this.clubAttendanceService.addAttendances({
        clubId,
        user: newUser,
        date,
      });
      ////////
      // attendance
      // club_attendance를 다박아줘야하네
      ////////
      // club_attendance
      // totalnum + 1
      // 출석 체크
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

  @Get('/test')
  async test(
    @Body('date') date: string, //
    @Body('clubId') clubId: number,
  ) {
    return this.clubAttendanceService.그날출석한유저리스트({ date, clubId });
  }
}
