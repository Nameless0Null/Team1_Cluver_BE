import { CreateClubDto } from './../club/dto/create-club.dto';
import { ApiProperty, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { IManagerWithoutPassword } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Club } from 'src/entity/club.entity';
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('NestJS Study API Docs')
    .setDescription('NestJS Study API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
export class LoginRequest {
  @ApiProperty()
  id: string;

  @ApiProperty()
  password: string;
}

export class signUpRequest {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}

export class clubsResponse {
  @ApiProperty()
  clubs: Promise<Club[]>;
}

export class createClubRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  img: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  is_public?: boolean;

  @ApiProperty()
  club_code?: string;
}

export class startCheckRequest {
  @ApiProperty()
  date: string;

  @ApiProperty()
  clubId: number;
}

export class startCheckResponse {
  @ApiProperty()
  checkCode: string;
}

export class doCheckRequest {
  @ApiProperty()
  date: string;

  @ApiProperty()
  clubId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  usercode: string;
}

export class codeCheckRequest {
  @ApiProperty()
  date: string;

  @ApiProperty()
  clubId: number;

  @ApiProperty()
  code: string;
}

export class clubId_date_Request {
  @ApiProperty()
  date: string;

  @ApiProperty()
  clubId: number;
}

export class doCheckResponse {}

export class email_Request {
  @ApiProperty()
  email: string;
}

export class clubId {
  @ApiProperty()
  clubId: number;
}

export class postWrite {
  @ApiProperty()
  clubId: number;

  @ApiProperty()
  content: string;
}
