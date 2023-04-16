import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import {ConfigModule} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import * as process from "process";
import {User} from "../../microservices-project/models/users.model";
import {Profile} from "../../microservices-project/models/profile.model";
import {Role} from "../../microservices-project/models/roles.model";
import {UserRoles} from "../../microservices-project/models/user-roles.model";

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
    SequelizeModule.forFeature([Role, UserRoles])
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
