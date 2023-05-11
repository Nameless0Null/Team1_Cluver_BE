import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  const port = 3000;

  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
