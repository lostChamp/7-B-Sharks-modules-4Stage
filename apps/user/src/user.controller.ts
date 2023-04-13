import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: "get-user-email-cmd"})
  async getUserByEmail(@Payload("dto") dto: CreateUserDto) {
    return this.userService.getUserByEmail(dto.mail);
  }

  @MessagePattern({cmd: "create-user-cmd"})
  async createUser(@Ctx() context: RmqContext, @Payload("userDto") userDto: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = this.userService.createUser(userDto);
    console.log(user);
    return user;
  }

}
