import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { EmailService } from './email.service';
import { email_success_html } from 'src/auth/utils';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { email_Request } from 'src/configs/swagger.config';

interface IParams {
  token: string;
  email: string;
}

@ApiTags('이메일')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ summary: '이메일 중복체크' })
  @ApiBody({
    type: email_Request,
  })
  @Post('/duplicate-check')
  async 이메일중복체크(
    @Body('email') email: string, //
  ) {
    const isExisting = await this.emailService.이메일중복체크({ email });
    return { isExisting };
  }

  @ApiOperation({ summary: '이메일 전송' })
  @ApiBody({
    type: email_Request,
  })
  @Post('/send')
  async 이메일전송(
    @Body('email') email: string, //
  ) {
    await this.emailService.이메일전송({ email });
    return '이메일 전송완료';
  }

  @ApiOperation({ summary: '이메일 인증완료 체크' })
  @ApiBody({
    type: email_Request,
  })
  @Post('/check')
  async 이메일인증완료체크(
    @Body('email') email: string, //
  ) {
    const result = await this.emailService.이메일인증완료체크({ email });
    if (result) return '인증완료';
    else return '인증안됨';
  }

  @Get('token=:token;email=:email')
  async completeAuth(
    @Param() params: IParams, //
  ) {
    const token = params.token;
    const email = params.email;

    const check_result = await this.emailService.checkToken({ token, email });
    if (check_result) return email_success_html;
    return '인증실패';
  }
}
