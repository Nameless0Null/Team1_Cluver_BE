import { IsNotEmpty } from 'class-validator';

export class CreateClubDto {
  img: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
