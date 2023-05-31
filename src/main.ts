import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './configs/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    );
  setupSwagger(app);

  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('API문서명')
  .setDescription('API문서 설명')
  .setVersion('1.0') // API 버전
  .addCookieAuth('connect.sid') // 쿠키 옵션
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);




  const port = 8000;

  app.enableCors();

  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
