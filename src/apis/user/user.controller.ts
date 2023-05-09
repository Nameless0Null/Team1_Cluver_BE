import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(
    @Req() req, //
  ) {
    console.log('userController login start');
  }

  @Get('/login')
  async fetchUser(
    @Req() req, //
  ) {
    console.log('userController fetchUser start');
  }

  @Post('/signup')
  async signUp(
    @Req() req, //
  ) {
    console.log('userController signUp start');
  }
}
