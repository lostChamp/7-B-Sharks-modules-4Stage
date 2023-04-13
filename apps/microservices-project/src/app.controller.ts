import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";

@Controller()
export class AppController {
  constructor(@Inject("AUTH_SERVICE") private authService: ClientProxy) {}

  @Post("registration")
  async registration(@Body() dtoUser: CreateUserDto) {
    return this.authService.send({cmd: "registration-cmd"}, {dtoUser});
  }

  @Post("login")
  async login(@Body() dtoUser: CreateUserDto) {
    return this.authService.send({cmd: "login-cmd"}, {dtoUser})
  }
}
