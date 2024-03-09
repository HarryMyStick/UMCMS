import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updateImageContribution(updateContributionUrlDto: UpdateContributionUrlDto): Promise<Contribution> {
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

  async getContributionsByFacultyName(facultyName: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty_id', 'f')
      .where('f.faculty_name = :facultyName', { facultyName })
      .andWhere('sc.status = :status', { status: 'Published' })
      .getMany();
  }

  async getContributionViaUserId(userId: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.user_id', 'user')
      .where('user.user_id = :userId', { userId })
      .getMany();
  }

  async updateContribution(createContributionDto: CreateContributionDto): Promise<Contribution> {
    const { contribution_id, user_id, academic_year_id, ...contributionData } = createContributionDto;
    const contribution = await this.contributionRepository.findOne({
      where: [{ contribution_id: contribution_id }],
    });
    if (!contribution) {
      throw new Error(`Contribution with ID ${contribution_id} not found`);
    }
    if (user_id) {
      const user = await this.userRepository.findOne({
        where: [{ user_id: user_id }],
      });
      if (!user) {
        throw new Error(`User with ID ${user_id} not found`);
      }
      contribution.user_id = user;
    }
    if (academic_year_id) {
      const academicYear = await this.academicYearRepository.findOne({
        where: [{ academic_year_id: academic_year_id }],
      });
      if (!academicYear) {
        throw new Error(`Academic year with ID ${academic_year_id} not found`);
      }
      contribution.academic_year_id = academicYear;
    }
    Object.assign(contribution, contributionData);
    await this.contributionRepository.save(contribution);

    return contribution;
  }

  async deleteContribution(contributionId: string): Promise<void> {
    const contribution = await this.contributionRepository.findOne({
      where: [{ contribution_id: contributionId }],
    });
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }
    await this.contributionRepository.remove(contribution);
  }

}
