import {Controller, Get, Post} from '@nestjs/common';
import { UserService } from './user.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: "get-user-email-cmd"})
  async getUserByEmail(@Ctx() context: RmqContext, @Payload("dtoUser") dtoUser: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.userService.getUserByEmail(dtoUser.mail);
    console.log(user);
    return user;
  }

  @MessagePattern({cmd: "create-user-cmd"})
  async createUser(@Ctx() context: RmqContext, @Payload("dtoUser") dtoUser: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.userService.createUser(dtoUser);
    console.log(user);
    return user;
  }

}
