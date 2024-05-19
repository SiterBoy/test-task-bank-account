import { Module } from '@nestjs/common';
import { AccountBalanceService } from './account-balance.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BalanceEntity} from "@/shared/db/entities/balance.entity";

@Module({
  imports:[TypeOrmModule.forFeature([BalanceEntity])],
  providers: [AccountBalanceService],
  exports:[AccountBalanceService]
})
export class AccountBalanceModule {}
