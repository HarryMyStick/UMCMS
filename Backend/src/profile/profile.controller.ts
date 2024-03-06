import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './models/dto/update-profile.dto';
import { Profile } from './models/entities/profile.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('updateProfile') 
  createUser(@Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return this.profileService.updateProfile(updateProfileDto);
  }

  @Get('getProfileByUserId/:userId')
  async getProfileByUserId(@Param('userId') userId: string): Promise<Profile> {
    const profile = await this.profileService.getProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

}