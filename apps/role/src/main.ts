import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';
import {UserModule} from "../../user/src/user.module";
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {ProfileModule} from "../../profile/src/profile.module";

async function bootstrap() {
  const app = await NestFactory.create(RoleModule);

  const configService = app.get(ConfigService);

  const USER = configService.get("RABBITMQ_USER");
  const PASSWORD = configService.get("RABBITMQ_PASSWORD");
  const HOST = configService.get("RABBITMQ_HOST");
  const QUEUE = configService.get("ROLE_QUEUE");

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
