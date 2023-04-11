import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getHello(): string {
    return this.roleService.getHello();
  }
}
