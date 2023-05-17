import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { EmailService } from './email.service';
import { email_success_html } from 'src/auth/utils';

interface IParams {
  token: string;
  email: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/duplicate-check')
  async 이메일중복체크(
    @Body('email') email: string, //
  ) {
    const isExisting = await this.emailService.이메일중복체크({ email });
    return { isExisting };
  }

  @Post('/send')
  async 이메일전송(
    @Body('email') email: string, //
  ) {
    await this.emailService.이메일전송({ email });
    return '이메일 전송완료';
  }

  @Post('/token-check')
  이메일인증번호체크(
    @Body('email') email: string, //
    @Body('token') token: string, //
  ) {}

  @Get('token=:token;email=:email')
  async completeAuth(
    @Param() params: IParams, //
  ) {
    const token = params.token;
    const email = params.email;
    console.log('params : ', params);
    const check_result = await this.emailService.checkToken({ token, email });
    if (check_result) return email_success_html;
    return '인증실패';
  }
}
