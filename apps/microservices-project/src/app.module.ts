import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as process from "process";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../models/users.model";
import {Profile} from "../models/profile.model";
import {Role} from "../models/roles.model";
import {UserRoles} from "../models/user-roles.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: "./.env"
      }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Profile, Role, UserRoles],
      autoLoadModels: true,
    }),
    JwtModule
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
      },
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
    {
      provide: "PROFILE_SERVICE",
      useFactory: (configService: ConfigService) => {
        const USER = configService.get("RABBITMQ_USER");
        const PASSWORD = configService.get("RABBITMQ_PASSWORD");
        const HOST = configService.get("RABBITMQ_HOST");
        const QUEUE = configService.get("PROFILE_QUEUE");

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
    {
      provide: "ROLE_SERVICE",
      useFactory: (configService: ConfigService) => {
        const USER = configService.get("RABBITMQ_USER");
        const PASSWORD = configService.get("RABBITMQ_PASSWORD");
        const HOST = configService.get("RABBITMQ_HOST");
        const QUEUE = configService.get("ROLE_QUEUE");

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
