import { IsString, Matches, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  manager_id: string;
  @IsNotEmpty()
  manager_password: string;
}
