import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/dto/create-user.dto';
import { User } from './models/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') 
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.login(createUserDto);
  }

  @Get('getFacultyByUserId/:user_id')
  async getFacultyByUserId(@Param('user_id') userId: string): Promise<Faculty> {
    return this.usersService.getFacultyByUserId(userId);
  }
}