import { Module } from '@nestjs/common';
import { ClubModule } from './club/club.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ClubModule, //
    TypeOrmModule.forRoot(typeORMConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
