import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  id: string;
  password: string;
}
