import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {CreateRoleDto} from "./dto/create-role.dto";

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({cmd: "create-role-cmd"})
  async createRole(@Ctx() context: RmqContext,
                   @Payload("dtoRole") dtoRole: CreateRoleDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const role = await this.roleService.createRole(dtoRole);

    return role;
  }

  @MessagePattern({cmd: "get-role-value-cmd"})
  async getRoleByValue(@Ctx() context: RmqContext,
                       @Payload("value") value: string) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    const role = await this.roleService.getRoleByValue(value);

    return role;
  }
}
