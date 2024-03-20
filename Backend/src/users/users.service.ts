import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/create-user.dto';
import { Role } from 'src/role/models/entities/role.entity';
import { ProfileService } from 'src/profile/profile.service';
import { FacultyService } from 'src/faculty/faculty.service';
import { RoleService } from 'src/role/role.service';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';
import { UpdateRoleUserDto } from './models/dto/update-role-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Faculty) private facultyRepository: Repository<Faculty>,
    private readonly profileService: ProfileService,
    private readonly facultyService: FacultyService,
    private readonly roleService: RoleService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }],
    });

    if (existingUser) {
      return existingUser;
    }

    const faculty = await this.facultyService.getFacultyByName(createUserDto.faculty_name);

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }
    const roleObj = await this.roleService.getRoleByName("Student");
    const roleId = roleObj.role_id;
    const role = await this.roleRepository.findOne({
      where: { role_id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      role: role,
      faculty_id: faculty,
    });

    await this.profileService.createProfile(user);

    await user.save();

    return user;
  }

  async login(createUserDto: CreateUserDto): Promise<User | undefined> {
    const { username, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { username, password },
      relations: ['role']
    });

    return existingUser;
  }

  async getFacultyByUserId(userId: string): Promise<Faculty> {
    const user = await this.usersRepository.findOne({
       where: { user_id: userId }, 
       relations: ['faculty_id']
      });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const faculty = user.faculty_id
    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }
    return faculty;
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
       where: { user_id: userId },
      });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsersWithRoles(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async updateUserRole(updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
    const { user_id, role_name } = updateRoleUserDto;
    const user = await this.usersRepository.findOne({
      where: { user_id: user_id },
      relations: ['role'], 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the role by roleName
    const role = await this.roleRepository.findOne({ where: { role_name: role_name } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Assign the found role's role_id to the user
    user.role = role;

    // Save the updated user entity
    await this.usersRepository.save(user);

    return user;
  }

  async deleteUser(user_id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: [{ user_id: user_id }],
    });
    if (!user) {
      throw new NotFoundException('Contribution not found');
    }
    await this.usersRepository.remove(user);
  }
}
