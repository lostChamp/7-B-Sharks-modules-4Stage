import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "../../microservices-project/models/profile.model";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
              @Inject("USER_SERVICE") private userService: ClientProxy) {}

  async createProfile(dtoProfile: CreateProfileDto, user) {
    const profile = await this.profileRepository.create(dtoProfile);
    await profile.update({user_id: user.id});
    return profile;
  }
}
