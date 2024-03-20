import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/dto/create-user.dto';
import { User } from './models/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';
import { UpdateRoleUserDto } from './models/dto/update-role-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @Post('getAllUserWithRole')
  async getAllUsersWithRoles(): Promise<User[]> {
    return this.usersService.getAllUsersWithRoles();
  }

  @Get('getUserByUserId/:user_id')
  async getUserByUserId(@Param('user_id') userId: string): Promise<User> {
    return this.usersService.getUserByUserId(userId);
  }

  @Post('updateUserRole')
  async updateUserRole(@Body() updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
    return this.usersService.updateUserRole(updateRoleUserDto);
  }

  @Post('deleteUser/:user_id')
  async deleteUser(@Param('user_id') user_id: string): Promise<void> {
    return this.usersService.deleteUser(user_id);
  }


}