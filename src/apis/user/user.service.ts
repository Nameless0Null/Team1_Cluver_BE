import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async method1() {
    console.log('userService method1 start');
  }

  async method2() {
    console.log('userService method2 start');
  }
}
