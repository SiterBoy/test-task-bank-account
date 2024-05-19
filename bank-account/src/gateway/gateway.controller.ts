import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AccountBalanceService } from '../modules/account-balance/account-balance.service'; // Убедитесь, что путь правильный
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('gateway')
export class GatewayController {
  private client: ClientProxy;

  constructor(
    private readonly accountBalanceService: AccountBalanceService
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
        queue: process.env.RABBITMQ_QUEUE,
        queueOptions: { durable: true },
      },
    });
  }

  @Post('balance/increase')
  async increaseBalance(@Body() data: { id: number; amount: number }) {
    const balance = await this.accountBalanceService.getBalance(data.id);
    if (!balance) {
      throw new BadRequestException(`Account with id ${data.id} not found`);
    }
    this.client.emit({ cmd: 'balance_update' }, { ...data, type: 'increase', version: balance.version });
    return { status: 'Request accepted' };
  }

  @Post('balance/decrease')
  async decreaseBalance(@Body() data: { id: number; amount: number }) {
    const balance = await this.accountBalanceService.getBalance(data.id);
    if (!balance) {
      throw new BadRequestException(`Account with id ${data.id} not found`);
    }
    this.client.emit({ cmd: 'balance_update' }, { ...data, type: 'decrease', version: balance.version });
    return { status: 'Request accepted' };
  }
}