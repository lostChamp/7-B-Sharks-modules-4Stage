import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as process from "process";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: "./.env"
      })
  ],
  controllers: [AppController],
  providers: [
      AppService,
      {
        provide: "AUTH_SERVICE",
        useFactory: (configService: ConfigService) => {
          const USER = configService.get("RABBITMQ_USER");
          const PASSWORD = configService.get("RABBITMQ_PASSWORD");
          const HOST = configService.get("RABBITMQ_HOST");
          const QUEUE = configService.get("AUTH_QUEUE");

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue: QUEUE,
              queueOptions: {
                durable: true
              }
            }
          })
        },
        inject: [ConfigService]
      }
  ],
})
export class AppModule {}
