import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepositiry: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;

    const existingUser = await this.usersRepositiry.findOne({
      where: [{ username }],
    });

    if (existingUser) {
      return existingUser;
    }
    createUserDto.role = 'user';

    const user = this.usersRepositiry.create(createUserDto);
    await user.save();
    return user;
  }

  async login(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const existingUser = await this.usersRepositiry.findOne({
      where: [{ username, password }],
    });
    if (existingUser) {
      return existingUser;
    }
  }
}
