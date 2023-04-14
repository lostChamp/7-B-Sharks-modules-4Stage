import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../../user/src/users.model";
import {Profile} from "./profile.model";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: "./.env"
  }),
    SequelizeModule.forFeature([Profile, User])
  ],
  controllers: [ProfileController],
  providers: [
      ProfileService,
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
    }
  ],
})
export class ProfileModule {}
