import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(
    private testService: TestService, //
  ) {}

  @Get('/create')
  async 정보가져오기(
    @Body('date') date: string, //
    @Body('clubId') clubId: number, //
  ) {}

  @Get('/download')
  async 엑셀다운로드(
    @Body('date') date: string, //
    @Body('clubId') clubId: number, //
  ) {
    console.log('액셀내보내기');
    await this.testService.엑셀만드는함수();
  }

  @Post('/create')
  async 엑셀내보내기(
    @Body('date') date: string, //
    @Body('clubId') clubId: number, //
    @Res() res,
  ) {
    console.log('액셀내보내기');
    await this.testService.엑셀만드는함수();
  }
}
