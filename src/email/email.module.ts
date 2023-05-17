import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Manager } from 'src/entity/manager.entity';
import { Email } from 'src/entity/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Email, User, Manager])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
