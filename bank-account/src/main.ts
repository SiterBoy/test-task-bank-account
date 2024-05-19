import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
      queue: process.env.RABBITMQ_QUEUE,
      queueOptions: { durable: true, autoDelete:false},
      noAck:false,
      socketOptions:{
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      }
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);
}
bootstrap();
