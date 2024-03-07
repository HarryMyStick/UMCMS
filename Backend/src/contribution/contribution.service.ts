import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from './models/entities/contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './models/dto/create-contribution.dto';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution) private contributionRepository: Repository<Contribution>,
  ) { }

  async createContribution(createContributionDto: CreateContributionDto): Promise<Contribution> {
    const { contribution_id } = createContributionDto;

    const existingUser = await this.contributionRepository.findOne({
      where: [{ contribution_id }],
    });

    if (existingUser) {
      return existingUser;
    }

    const contribution = this.contributionRepository.create(createContributionDto);
    await contribution.save();
    return contribution;
  }
}
