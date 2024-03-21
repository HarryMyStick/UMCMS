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
import { AdminCreateUserDto } from './models/dto/admin-create-user.dto';
import { Profile } from 'src/profile/models/entities/profile.entity';

@Injectable()
export class UsersService {
  profileRepository: any;
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
      faculty: faculty,
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
       relations: ['faculty']
      });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const faculty = user.faculty
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
    return this.usersRepository.find({ relations: ['role', 'faculty']});
  }

  async updateUser(updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
    const { user_id, role_name, faculty_name, password} = updateRoleUserDto;
    const user = await this.usersRepository.findOne({
      where: { user_id: user_id },
      relations: ['role', 'faculty'], 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the role by roleName
    const role = await this.roleRepository.findOne({ where: { role_name: role_name } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const faculty = await this.facultyRepository.findOne({ where: { faculty_name: faculty_name } });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    // Assign the found role's role_id to the user
    user.role = role;
    user.faculty = faculty;
    user.password = password;

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

  async adminCreateUser(adminCreateUserDto: AdminCreateUserDto): Promise<User> {
    const { username, faculty_id, role_id } = adminCreateUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }],
    });

    if (existingUser) {
      return existingUser;
    }

    const faculty = await this.facultyRepository.findOne({
      where: [{ faculty_id: faculty_id}],
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    const role = await this.roleRepository.findOne({
      where: { role_id: role_id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({
      ...adminCreateUserDto,
      role: role,
      faculty: faculty,
    });

    await this.profileService.createProfile(user);

    await user.save();

    return user;
  }

  async findProfileByRoleAndFaculty(facultyName: string): Promise<Profile | undefined> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.faculty', 'faculty')
      .where('role.role_name = :roleName', { roleName: 'Marketing Coordinator' })
      .andWhere('faculty.faculty_name = :facultyName', { facultyName })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.profileService.getProfileByUserId(user.user_id);
  }

}
