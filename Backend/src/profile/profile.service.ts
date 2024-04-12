import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './models/entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './models/dto/update-profile.dto';
import { User } from 'src/users/models/entities/user.entity';
import { Equal } from 'typeorm';
import axios from 'axios';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) { }

  async createProfile(user: User): Promise<Profile> {
    const profile = new Profile();
    profile.user = user;
    await profile.save();
    return profile;
  }

  async adminCreateProfile(user: User, email: string): Promise<Profile> {
    const profile = new Profile();
    profile.user = user;
    profile.email = email;
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

  async updateEmail(profile_id: string, email: string): Promise<Profile> {

    let existingProfile = await this.profileRepository.findOne({
      where: { profile_id },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    existingProfile.email = email;

    await this.profileRepository.save(existingProfile);

    return existingProfile;
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: Equal(userId) },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  private generateRandomCode(): string {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async checkAccount(userId: string, email: string): Promise<{ success: boolean, code: string }> {
    const profile = await this.profileRepository.findOne({
      where: { user: Equal(userId), email: email },
    });

    if (!profile) {
      return { success: false, code: '' };
    }

    const code = this.generateRandomCode();
    const requestBody = {
      recipientEmail: profile.email,
      subject: 'UMCMS System - Code To Change Password',
      message: `You have to enter this code to renew your password, please do not let this code public. Code: ${code}`
    };

    await axios.post('http://localhost:3001/email/send', requestBody);
    
    return { success: true, code };
  }
}
