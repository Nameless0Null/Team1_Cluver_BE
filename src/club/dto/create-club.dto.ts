import { IsNotEmpty } from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
