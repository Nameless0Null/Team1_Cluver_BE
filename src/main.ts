import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './configs/swagger.config';

export const SERVER_URL = `http://localhost:8000`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  const port = 8000;

  app.enableCors();

  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
