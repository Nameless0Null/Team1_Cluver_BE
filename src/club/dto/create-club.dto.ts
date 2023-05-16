import { IsNotEmpty } from 'class-validator';

export class CreateClubDto {
  img: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  is_public: boolean;

  club_code: string;
}
