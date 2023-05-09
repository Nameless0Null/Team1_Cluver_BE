import { Module } from '@nestjs/common';
import { ClubModule } from './club/club.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), //
    ClubModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
