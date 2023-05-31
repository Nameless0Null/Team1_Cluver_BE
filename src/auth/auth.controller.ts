import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService, IManagerWithoutPassword } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from './security/auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from 'src/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { Manager } from 'src/entity/manager.entity';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequest, signUpRequest } from 'src/configs/swagger.config';


import { RolesGuard } from './security/roles.guard';
import { RoleType } from './role-type';
import { Roles } from './decorator/role.decorator';

import { Response, Request } from 'express';


interface OutputSignIn {
  accessToken: string;
  manager: IManagerWithoutPassword;
}
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  // Body에 대한 명세 설정
  @ApiBody({
    type: signUpRequest,
  })
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto, //
  ) {
    return this.authService.signUp(authCredentialDto);
  }

  @ApiOperation({ summary: '로그인' })
  // Body에 대한 명세 설정
  @ApiBody({
    type: LoginRequest,
  })
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) loginDto: LoginDto, //
  ): Promise<{ accessToken: string; manager: IManagerWithoutPassword }> {
    return this.authService.signIn(loginDto);
  }

  @ApiOperation({ summary: '토큰 유효성 검증' })
  @ApiCreatedResponse({
    description: '맞으면 true, 아니면 401에러',
    type: Boolean,
  })
  @Get('/check')
  @UseGuards(AuthGuard())
  authCheck(
    @GetUser() manager: Manager, //
  ) {
    return true as boolean;
  }


  //___________________________________________________________________________________________________________________


}
