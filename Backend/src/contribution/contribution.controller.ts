import { Controller, Post, Body, UseInterceptors, UploadedFile} from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './models/dto/create-contribution.dto';
import { Contribution } from './models/entities/contribution.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import fs from 'fs';

@ApiTags('Contribution')
@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post('createContribution') 
  @UseInterceptors(FileInterceptor('articleFile')) 
  async createContribution(
    @Body() createContributionDto: CreateContributionDto,
    @UploadedFile() file: Express.Multer.File 
  ): Promise<Contribution> {
    const uploadFolder = 'uploads';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    createContributionDto.article_content_url = filePath;

    return this.contributionService.createContribution(createContributionDto);
  }
}