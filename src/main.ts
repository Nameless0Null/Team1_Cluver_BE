import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  const serverConfig: any = config.get('server');
  const port = serverConfig.port;

  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
