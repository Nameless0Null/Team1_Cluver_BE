import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from 'src/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto, //
  ) {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto, //
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }

  // req 찍기
  // @Post('/test')
  // @UseGuards(AuthGuard())
  // authTest(
  //   @Req() req, //
  // ) {
  //   console.log('req.user : ', req.user);
  // }

  @Post('/test')
  @UseGuards(AuthGuard())
  authTest(
    @GetUser() user: User, //
  ) {
    console.log('user : ', user);
  }
}
