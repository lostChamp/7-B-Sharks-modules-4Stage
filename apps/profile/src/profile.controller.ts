import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {CreateProfileDto} from "./dto/create-profile.dto";

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({cmd: "create-profile-cmd"})
  async createProfile(@Ctx() context: RmqContext,
                      @Payload("dtoProfile") dtoProfile: CreateProfileDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const profile = await this.profileService.createProfile(dtoProfile);

    return profile
  }
}
