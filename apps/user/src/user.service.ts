import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {User} from "../../microservices-project/models/users.model";
import {ProfileService} from "../../profile/src/profile.service";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";
import sequelize from "sequelize";

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              @Inject("PROFILE_SERVICE") private profileService: ClientProxy) {}

  async createUser(dtoUser: CreateUserDto, role) {
    const user = await this.userRepository.create(dtoUser);
    await user.$set("roles", [role.id]);
    return user;
  }
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

  async updateCreatedUserNow(user, profile, role) {
    user.roles = [role];
    user.profile = profile;
    return user;
  }
}
