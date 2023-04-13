import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: "registration-cmd"})
  async registration(@Ctx() context: RmqContext, @Payload("dtoUser") dtoUser: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.authService.registration(dtoUser);

    return user;
  }

  @MessagePattern({cmd: "login-cmd"})
  async login(@Ctx() context: RmqContext, @Payload("dto") dto: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.authService.login(dto);

    return user;
  }
}
