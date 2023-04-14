import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {User} from "./users.model";
import {ProfileService} from "../../profile/src/profile.service";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              @Inject("PROFILE_SERVICE") private profileService: ClientProxy) {}

  async createUser(dtoUser: CreateUserDto) {
    const user = await this.userRepository.create(dtoUser);
    const profile = await lastValueFrom(this.profileService.send({cmd: "create-profile-cmd"}, {dtoUser}));
    // const role = await this.roleService.getRoleByValue("USER");
    // await user.$set("roles", [role.id]);
    // user.roles = [role];
    user.profile = profile;
    return user;
  }
// , dtoProfile: CreateProfileDto
  async getAllUsers() {
    const users = await this.userRepository.findAll({include: {all: true}});
    return users;
  }

  async getUserByEmail(mail: string) {
    const user = await this.userRepository.findOne({where: {mail}, include: {all: true}});
    return user;
  }

  async deleteUserById(userId: number) {
    const id = String(userId);
    const user = await this.userRepository.destroy({where: {id}});
    return user;
  }
}
