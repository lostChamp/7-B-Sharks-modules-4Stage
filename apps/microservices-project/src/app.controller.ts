import {Body, Controller, Inject, Post} from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {lastValueFrom} from "rxjs";
import {JwtService} from "@nestjs/jwt";


@Controller()
export class AppController {
  constructor(@Inject("AUTH_SERVICE") private authService: ClientProxy,
              @Inject("USER_SERVICE") private userService: ClientProxy,
              @Inject("PROFILE_SERVICE") private profileService: ClientProxy,
              @Inject("ROLE_SERVICE") private roleService: ClientProxy,
              private jwtService: JwtService) {}

  @Post("registration")
  async registration(@Body() dtoUser: CreateUserDto) {
    const hashPassword = await bcrypt.hash(dtoUser.password, 5);
    dtoUser = {...dtoUser, password: hashPassword};
    const role = await lastValueFrom(this.roleService.send({cmd: "get-role-value-cmd"}, {value: "ADMIN"}));
    const userTemp = await lastValueFrom(this.userService.send({cmd: "create-user-cmd"}, {dtoUser, role}));
    const profile = await lastValueFrom(this.profileService.send({cmd: "create-profile-cmd"}, {dtoUser, userTemp}));
    const user = await lastValueFrom(this.userService.send({cmd: "update-user-now-cmd"}, {userTemp, profile, role}));
    return this.authService.send({cmd: "registration-cmd"}, {user});
  }

  @Post("login")
  async login(@Body() dtoUser: CreateUserDto) {
    return this.authService.send({cmd: "login-cmd"}, {dtoUser})
  }
}
