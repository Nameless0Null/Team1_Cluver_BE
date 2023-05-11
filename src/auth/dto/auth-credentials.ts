import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  manager_id: string;
  manager_email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  manager_name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영어와 숫자로만 구성해야함',
  })
  manager_password: string;
}
