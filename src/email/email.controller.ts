import { Controller, Get, Body, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('/check')
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

  @Get()
  이메일인증번호체크(
    @Body('email') email: string, //
    @Body('token') token: string, //
  ) {
    this.emailService.이메일인증번호체크({ email, token });
    return '이메일 인증';
  }
}
