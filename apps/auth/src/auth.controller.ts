import {Controller, Get, Inject} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ClientProxy, Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";
import {lastValueFrom} from "rxjs";
import {User} from "../../microservices-project/models/users.model";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: "registration-cmd"})
  async registration(@Ctx() context: RmqContext, @Payload("user") userInfo: typeof User) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.authService.registration(userInfo);

    return user;
  }

  @MessagePattern({cmd: "login-cmd"})
  async login(@Ctx() context: RmqContext, @Payload("dtoUser") dtoUser: CreateUserDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const user = await this.authService.login(dtoUser);

    return user;
  }


}
