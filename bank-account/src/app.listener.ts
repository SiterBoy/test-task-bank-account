import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import {AccountBalanceService} from "@/modules/account-balance/account-balance.service";

@Controller()
export class AppListener {
  private readonly logger = new Logger(AppListener.name);

  constructor(private readonly accountBalanceService: AccountBalanceService) {}

  @EventPattern({ cmd: 'balance_update' })
  async handleBalanceUpdate(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('Message Received');
    const channel: Channel = context.getChannelRef();
    const originalMessage: Message = context.getMessage() as Message;
    const { id, amount, type, version } = data;

    // this.logger.debug(`Message properties: ${JSON.stringify(originalMessage.properties)}`);
    // this.logger.debug(`Message fields: ${JSON.stringify(originalMessage.fields)}`);

    try {
      if (type === 'increase') {
        await this.accountBalanceService.updateBalanceWithLock(id, amount, version);
      } else if (type === 'decrease') {
        await this.accountBalanceService.updateBalanceWithLock(id, -amount, version);
      }

      this.logger.debug(`Message processed successfully for id: ${id}`);
      channel.ack(originalMessage);
    } catch (error) {
      if (error.message === 'Balance has been updated') {
        this.logger.warn(`Conflict detected for id ${id}. Retrying...`);
        channel.nack(originalMessage, false, true);
      }
    }
  }
}