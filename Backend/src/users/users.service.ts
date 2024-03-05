import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }],
    });

    if (existingUser) {
      return existingUser;
    }

    const user = this.usersRepository.create(createUserDto);
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
