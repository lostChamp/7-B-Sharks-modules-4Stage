import {HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import * as bcrypt from "bcryptjs";


@Injectable()
export class AuthService {

  constructor(@Inject("USER_SERVICE") private userService: ClientProxy,
              private jwtService: JwtService) {}
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }


  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.send({cmd: "create-user-cmd"}, {userDto});
    console.log(candidate);
    // if(candidate) {
    //   throw new HttpException("Пользователь с таким mail существует", HttpStatus.BAD_REQUEST);
    // }
    const hashPassword = await bcrypt.hash(candidate["password"], 5);
    const user = await this.userService.send({cmd: "create-user-cmd"}, {...userDto, password: hashPassword});
    return this.generateToken(user);
  }
// , profileDto: CreateProfileDto
  private async generateToken(user) {
    const payload = {mail: user.mail, id: user.id}
    return {
      token: this.jwtService.sign(payload)
    }
  }
// , roles: user.roles, profile: user.profile
  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.send({cmd: "get-user-email-cmd"}, {userDto});
    const passwordEquals = await bcrypt.compare(userDto.password, user["password"]);
    if(user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({message: "Неверный логин/пароль"});
  }

}
