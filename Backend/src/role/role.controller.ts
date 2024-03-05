import { Controller, Post, Body, NotFoundException, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './models/dto/create-role.dto';
import { Role } from './models/entities/role.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post('createRole')
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }
  
  @Get('getRoles')
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRoleById(id);
  }

  @Get('byName/:roleName')
  async getRoleByName(@Param('roleName') roleName: string): Promise<Role> {
    return this.roleService.getRoleByName(roleName);
  }
}