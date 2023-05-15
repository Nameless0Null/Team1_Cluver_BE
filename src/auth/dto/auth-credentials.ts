import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  id: string;
  email: string;

  @IsString()
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영어와 숫자로만 구성해야함',
  })
  password: string;
}
