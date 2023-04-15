import {Controller, Get, Post} from '@nestjs/common';
import { UserService } from './user.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "./dto/create-user.dto";
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";
import {User} from "../../microservices-project/models/users.model";
import {Profile} from "../../microservices-project/models/profile.model";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: "get-user-email-cmd"})
  async getUserByEmail(@Ctx() context: RmqContext, @Payload("dtoUser") dtoUser: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.userService.getUserByEmail(dtoUser.mail);
    return user;
  }

  @MessagePattern({cmd: "create-user-cmd"})
  async createUser(@Ctx() context: RmqContext,
                   @Payload("dtoUser") dtoUser: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.userService.createUser(dtoUser);
    return user;
  }

  @MessagePattern({cmd: "update-user-now-cmd"})
  async updateUserCreatedNow(@Ctx() context: RmqContext,
                   @Payload("userTemp") userInfo: typeof User,
                    @Payload("profile") profileInfo: typeof Profile) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.userService.updateCreatedUserNow(userInfo, profileInfo);
    return user;
  }

}
