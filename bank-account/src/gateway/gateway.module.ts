import {Module} from "@nestjs/common";
import {GatewayController} from "@/gateway/gateway.controller";
import {AccountBalanceService} from "@/modules/account-balance/account-balance.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BalanceEntity} from "@/shared/db/entities/balance.entity";

@Module({
  imports:[TypeOrmModule.forFeature([BalanceEntity])],
  controllers: [GatewayController],
  providers:[AccountBalanceService]
})
export class GatewayModule{}