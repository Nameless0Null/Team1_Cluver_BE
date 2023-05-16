import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClubAttendanceService } from './club_attendance.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  doCheckRequest,
  doCheckResponse,
  startCheckRequest,
  startCheckResponse,
} from 'src/configs/swagger.config';

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

    // [club attendance]
    // 해당 날짜 row 추가
    // clubId에 연결되어있는 전체 유저수 긁어와서, totalNum에 박기
    // this.clubAttendanceService.addClubAttendanceRow({
    //   date: '1월1일',
    //   clubId: 1,
    // });
    ////////////
    ////////////

    // [attendance]
    // 해당 clubId / 새로 만들어진 ClubAttendance Id 가져와
    // 해당 clubId의 모든 유저들에게 반복문 돌린다
    // 해당 유저의 id, club_attendance Id, isChecked = 0 row를
    // attendance 테이블에 추가 (모든 유저들한테)
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
    // const isSuccess = await this.clubAttendanceService.checkCode({
    //   clubId,
    //   date,
    //   code,
    // });
    // if (!isSuccess) return '출석코드가 틀림';

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

    // 만약 기존에 있던 유저면
    // [club attendance]
    // checkNum + 1
    ////////////
    // [attendance]
    // (userId, club_attendanceId ) 에 맞는 row 찾아와서, isChecked를 1로 수정
    ////////////
    ////////////
    // 만약 새로운 유저면
    // [attendance]
    // 해당
  }
}
