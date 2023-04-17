import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {UserModule} from "./user.module";

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  const configService = app.get(ConfigService);

  const USER = configService.get("RABBITMQ_USER");
  const PASSWORD = configService.get("RABBITMQ_PASSWORD");
  const HOST = configService.get("RABBITMQ_HOST");
  const QUEUE = configService.get("USER_QUEUE");

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
