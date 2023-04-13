import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as process from "process";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);

  const USER = configService.get("RABBITMQ_USER");
  const PASSWORD = configService.get("RABBITMQ_PASSWORD");
  const HOST = configService.get("RABBITMQ_HOST");
  const QUEUE = configService.get("AUTH_QUEUE");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true
      }
    }
  });

  await app.startAllMicroservices();
}
bootstrap();
