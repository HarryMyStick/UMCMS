import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './models/entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './models/dto/update-profile.dto';
import { User } from 'src/users/models/entities/user.entity';
import { Equal } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) { }

  async createProfile(user: User): Promise<Profile> {
    const profile = new Profile();
    profile.user_id = user;
    await profile.save();
    return profile;
}

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const { profile_id, first_name, last_name, email, phone_number } = updateProfileDto;
  
    let existingProfile = await this.profileRepository.findOne({
      where: { profile_id },
    });
  
    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }
    
    existingProfile.first_name = first_name;
    existingProfile.last_name = last_name;
    existingProfile.email = email;
    existingProfile.phone_number = phone_number;
  
    await this.profileRepository.save(existingProfile);
  
    return existingProfile;
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user_id: Equal(userId) },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
  
}
