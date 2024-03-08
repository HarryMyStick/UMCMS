import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from './models/entities/contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './models/dto/create-contribution.dto';
import { User } from 'src/users/models/entities/user.entity';
import { AcademicYear } from 'src/academic_year/models/entities/academic-year.entity';
import { UpdateContributionUrlDto } from './models/dto/update_contribution_url.dto';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution) private contributionRepository: Repository<Contribution>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AcademicYear) private academicYearRepository: Repository<AcademicYear>,
  ) { }

  async createContribution(createContributionDto: CreateContributionDto): Promise<Contribution> {
    const { user_id, academic_year_id, ...contributionData } = createContributionDto;

    const user = await this.userRepository.findOne({
      where: [{ user_id: user_id }],
    });
    if (!user) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const academicYear = await this.academicYearRepository.findOne({
      where: [{ academic_year_id: academic_year_id }],
    });
    if (!academicYear) {
      throw new Error(`Academic year with ID ${academic_year_id} not found`);
    }

    const contribution = this.contributionRepository.create({
      ...contributionData,
      user_id: user,
      academic_year_id: academicYear,
    });

    await contribution.save();
    return contribution;
  }

  async updateContribution(updateContributionUrlDto: UpdateContributionUrlDto): Promise<Contribution> {
    const cont = await this.contributionRepository.findOne({
      where: [{ contribution_id: updateContributionUrlDto.contribution_id }],
    });
    if (!cont) {
      throw new Error(`Contribution with id ${updateContributionUrlDto.contribution_id} not found`);
    }
    
    // Update the image_url field of the contribution entity
    cont.image_url = updateContributionUrlDto.image_url;
  
    // Save the updated contribution entity
    await this.contributionRepository.save(cont);
  
    return cont;
  }
  

}
