import { Controller, Post, Body } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './models/dto/create-contribution.dto';
import { Contribution } from './models/entities/contribution.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contribution')
@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post('createContribution') 
  createContribution(@Body() createContributionDto: CreateContributionDto): Promise<Contribution> {
    return this.contributionService.createContribution(createContributionDto);
  }
}