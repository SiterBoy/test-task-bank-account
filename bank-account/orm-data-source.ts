import { DataSource } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';

config();

const entitiesPath = path.join(__dirname, 'src', 'shared', 'db', 'entities', '*.entity{.ts,.js}');
const migrationsPath = path.join(__dirname, 'src', 'shared', 'db', 'migrations', '**', '*{.ts,.js}');

console.log('Entities path:', entitiesPath);
console.log('Migrations path:', migrationsPath);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
});
