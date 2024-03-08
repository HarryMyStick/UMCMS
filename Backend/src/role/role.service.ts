import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './models/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './models/dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) { }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { role_name } = createRoleDto;

    const existingRole = await this.roleRepository.findOne({
      where: { role_name },
    });

    if (existingRole) {
      return existingRole;
    }

    const role = this.roleRepository.create(createRoleDto);
    await role.save();
    return role;
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role_id: id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async getRoleByName(roleName: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role_name: roleName },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
