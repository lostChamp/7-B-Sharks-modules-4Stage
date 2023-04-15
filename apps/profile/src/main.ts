import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import {UserModule} from "../../user/src/user.module";
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {Profile} from "../../microservices-project/models/profile.model";

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  const configService = app.get(ConfigService);

  const USER = configService.get("RABBITMQ_USER");
  const PASSWORD = configService.get("RABBITMQ_PASSWORD");
  const HOST = configService.get("RABBITMQ_HOST");
  const QUEUE = configService.get("PROFILE_QUEUE");

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
