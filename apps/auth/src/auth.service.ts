import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import {lastValueFrom} from "rxjs";


@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService,
              @Inject("USER_SERVICE") private userService: ClientProxy) {}
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }


  async registration(user) {
    return this.generateToken(user);
  }
  private async generateToken(user) {
    const payload = {mail: user.mail, id: user.id, roles: user.roles, profile: user.profile}
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(dtoUser: CreateUserDto) {
    const user = await lastValueFrom(this.userService.send({cmd: "get-user-email-cmd"}, {dtoUser}));
    const passwordEquals = await bcrypt.compare(dtoUser.password, user.password);
    if(user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({message: "Неверный логин/пароль"});
  }

}
