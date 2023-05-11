import { DataSource } from 'typeorm';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm/dist';
import * as config from 'config';
import { ConfigModule, ConfigService } from '@nestjs/config';

const dbConfig: any = config.get('db');
export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: dbConfig.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: dbConfig.synchronize,
    };
  }
}

export const typeORMConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
