import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Param, Patch, Delete } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './models/dto/create-contribution.dto';
import { Contribution } from './models/entities/contribution.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateContributionUrlDto } from './models/dto/update_contribution_url.dto';

@ApiTags('Contribution')
@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) { }

  @Post('createContribution') 
  @UseInterceptors(FileInterceptor('articleFile')) 
  async createContribution(
    @Body() createContributionDto: CreateContributionDto,
    @UploadedFile() file: Express.Multer.File 
  ): Promise<Contribution> {
    const uploadFolder = 'src/contribution/uploads';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    createContributionDto.article_content_url = filePath;

    return this.contributionService.createContribution(createContributionDto);
  }

  @Post('uploadImage') 
  @UseInterceptors(FileInterceptor('imageFile')) 
  async uploadImage(
    @Body() updateContributionUrlDto: UpdateContributionUrlDto,
    @UploadedFile() file: Express.Multer.File 
  ): Promise<Contribution> {
    const uploadFolder = 'src/contribution/uploads/img';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);
  
    fs.writeFileSync(filePath, file.buffer);
  
    updateContributionUrlDto.image_url = filePath;
  
    return this.contributionService.updateImageContribution(updateContributionUrlDto);
  }

  @Get('getContributionViaFacultyName/:facultyName')
  async getContributionViaFacultyName(@Param('facultyName') facultyName: string): Promise<Contribution[]> {
    return this.contributionService.getContributionsByFacultyName(facultyName);
  }

  @Get('getContributionViaUserId/:user_id')
  async getContributionViaUserId(@Param('user_id') user_id: string): Promise<Contribution[]> {
    return this.contributionService.getContributionViaUserId(user_id);
  }

  @Patch('updateContribution')
  @UseInterceptors(FileInterceptor('articleFile')) 
  async updateContribution(
    @Body() createContributionDto: CreateContributionDto,
    @UploadedFile() file: Express.Multer.File 
  ): Promise<Contribution> {
    const uploadFolder = 'src/contribution/uploads';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    createContributionDto.article_content_url = filePath;

    return this.contributionService.updateContribution(createContributionDto);
  }

  @Delete('deleteContribution/:contributionId')
  async deleteContribution(
    @Param('contributionId') contributionId: string
  ): Promise<void> {
    return this.contributionService.deleteContribution(contributionId);
  }
  
}