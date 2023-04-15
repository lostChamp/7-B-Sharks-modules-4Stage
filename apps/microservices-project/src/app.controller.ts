import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from "bcryptjs";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {lastValueFrom} from "rxjs";

@Controller()
export class AppController {
  constructor(@Inject("AUTH_SERVICE") private authService: ClientProxy,
              @Inject("USER_SERVICE") private userService: ClientProxy,
              @Inject("PROFILE_SERVICE") private profileService: ClientProxy) {}

  @Post("registration")
  async registration(@Body() dtoUser: CreateUserDto) {
    const hashPassword = await bcrypt.hash(dtoUser.password, 5);
    dtoUser = {...dtoUser, password: hashPassword};
    const userTemp = await lastValueFrom(this.userService.send({cmd: "create-user-cmd"}, {dtoUser}));
    const profile = await lastValueFrom(this.profileService.send({cmd: "create-profile-cmd"}, {dtoUser, userTemp}));
    const user = await lastValueFrom(this.userService.send({cmd: "update-user-now-cmd"}, {userTemp, profile}));
    return this.authService.send({cmd: "registration-cmd"}, {user});
  }

  @Post("login")
  async login(@Body() dtoUser: CreateUserDto) {
    return this.authService.send({cmd: "login-cmd"}, {dtoUser})
  }
}
