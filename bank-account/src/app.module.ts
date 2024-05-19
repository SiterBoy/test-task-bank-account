import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountBalanceModule } from './modules/account-balance/account-balance.module';
import { AppDataSource } from '../orm-data-source';
import * as path from "path";
import { GatewayModule } from "@/gateway/gateway.module";
import { AppListener } from "@/app.listener";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [path.join(__dirname, 'shared', 'db', 'entities', '*.entity{.ts,.js}')],
        migrations: [path.join(__dirname, 'shared', 'db', 'migrations', '**', '*{.ts,.js}')],
        synchronize: false,
      }),
    }),
    GatewayModule,
    AccountBalanceModule,
  ],
  controllers:[AppListener]
})
export class AppModule {}