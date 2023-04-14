import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {lastValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
              @Inject("USER_SERVICE") private userService: ClientProxy) {}

  async createProfile(dtoProfile: CreateProfileDto) {
    const profile = await this.profileRepository.create(dtoProfile);
    const user = await lastValueFrom(this.userService.send({cmd: "get-user-email-cmd"}, {dtoProfile}));
    await profile.update({user_id: user.id});
    return profile;
  }
}
