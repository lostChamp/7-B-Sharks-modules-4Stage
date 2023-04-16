import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as process from "process";
import {JwtModule} from "@nestjs/jwt";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../../microservices-project/models/users.model";
import {Profile} from "../../microservices-project/models/profile.model";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h"
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./.env"
    })
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
    {
      provide: "USER_SERVICE",
      useFactory: (configService: ConfigService) => {
        const USER = configService.get("RABBITMQ_USER");
        const PASSWORD = configService.get("RABBITMQ_PASSWORD");
        const HOST = configService.get("RABBITMQ_HOST");
        const QUEUE = configService.get("USER_QUEUE");

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
    },
  ],
  exports: [
    JwtModule
  ]
})
export class AuthModule {}
