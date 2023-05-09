import { DataSource } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '12345678',
  database: 'test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
