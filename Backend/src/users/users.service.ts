import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/create-user.dto';
import { Role } from 'src/role/models/entities/role.entity';
import { ProfileService } from 'src/profile/profile.service';
import { FacultyService } from 'src/faculty/faculty.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly profileService: ProfileService,
    private readonly facultyService: FacultyService,
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

    const roleId: string = '8195c61a-aa59-421f-bcda-d832243efe86';
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
}
