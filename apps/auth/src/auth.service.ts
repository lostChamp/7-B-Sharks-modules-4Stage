import {HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import {lastValueFrom} from "rxjs";
import {validateEach} from "@nestjs/common/utils/validate-each.util";


@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService,
              @Inject("USER_SERVICE") private userService: ClientProxy) {}
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }


  async registration(dtoUser: CreateUserDto) {
    const candidate = await lastValueFrom(this.userService.send({cmd: "get-user-email-cmd"}, {dtoUser}));
    if(candidate) {
      throw new HttpException("Пользователь с таким mail существует", HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(dtoUser.password, 5);
    dtoUser = {...dtoUser, password: hashPassword};
    const user = await lastValueFrom(this.userService.send({cmd: "create-user-cmd"}, {dtoUser}));
    return this.generateToken(user);
  }
  private async generateToken(user) {
    const payload = {mail: user.mail, id: user.id}
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
