import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]), //
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
