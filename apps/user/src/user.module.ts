import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as process from "process";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../../microservices-project/models/users.model";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {Profile} from "../../microservices-project/models/profile.model";

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
          models: [User, Profile],
          autoLoadModels: true,
      }),
      SequelizeModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [
      UserService,
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
      }
  ],
})
export class UserModule {}
