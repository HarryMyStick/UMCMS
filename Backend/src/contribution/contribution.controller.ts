import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Param, Delete, Res } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './models/dto/create-contribution.dto';
import { Contribution } from './models/entities/contribution.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateStatusDto } from './models/dto/update-status.dto';
import { UpdateContributionUrlDto } from './models/dto/update-contribution_url.dto';
import { Response } from 'express';
import { ContributionYearFacDto } from './models/dto/contribution-year-fac.dto';
import { UpdateContributionDto } from './models/dto/update-contribution.dto';
import { ContributionYearFacUDto } from './models/dto/contribution-year-fac-u.dto';
import { UpdateCommentDto } from './models/dto/update-comment.dto';

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

    createContributionDto.article_content_url = filename;

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

    updateContributionUrlDto.image_url = filename;

    return this.contributionService.updateImageContribution(updateContributionUrlDto);
  }

  @Get('getPublishContributionsByFacultyName/:facultyName')
  async getPublishContributionsByFacultyName(@Param('facultyName') facultyName: string): Promise<Contribution[]> {
    return this.contributionService.getPublishContributionsByFacultyName(facultyName);
  }

  @Post('getPublishContributionsByFacultyNameAndByYear')
  getPublishContributionsByFacultyNameAndByYear(@Body() contributionYearFacDto: ContributionYearFacDto): Promise<Contribution[]> {
    return this.contributionService.getPublishContributionsByFacultyNameAndByYear(contributionYearFacDto);
  }

  @Post('getContributionsByFacultyNameAndByYear')
  getContributionsByFacultyNameAndByYear(@Body() contributionYearFacDto: ContributionYearFacDto): Promise<Contribution[]> {
    return this.contributionService.getContributionsByFacultyNameAndByYear(contributionYearFacDto);
  }

  @Post('getContributionsByFacultyNameByYearByUserId')
  getContributionsByFacultyNameByYearByUserId(@Body() contributionYearFacUDto: ContributionYearFacUDto): Promise<Contribution[]> {
    return this.contributionService.getContributionsByFacultyNameByYearByUserId(contributionYearFacUDto);
  }

  @Get('getContributionsByFacultyName/:facultyName')
  async getContributionsByFacultyName(@Param('facultyName') facultyName: string): Promise<Contribution[]> {
    return this.contributionService.getContributionsByFacultyName(facultyName);
  }

  @Get('getContributionViaUserId/:user_id')
  async getContributionViaUserId(@Param('user_id') user_id: string): Promise<Contribution[]> {
    return this.contributionService.getContributionViaUserId(user_id);
  }

  @Get('getContributionByContributionId/:contributionId')
  async getContributionByContributionId(@Param('contributionId') contributionId: string): Promise<Contribution> {
    return this.contributionService.getContributionByContributionId(contributionId);
  }

  @Post('updateContribution')
  @UseInterceptors(FileInterceptor('articleFile'))
  async updateContribution(
    @Body() updateContributionDto: UpdateContributionDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Contribution> {
    if (file) {
      const uploadFolder = 'src/contribution/uploads';
      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadFolder, filename);
      fs.writeFileSync(filePath, file.buffer);
      updateContributionDto.article_content_url = filename;
    }
    return this.contributionService.updateContribution(updateContributionDto);
  }

  @Delete('deleteContribution/:contributionId')
  async deleteContribution(
    @Param('contributionId') contributionId: string
  ): Promise<void> {
    return this.contributionService.deleteContribution(contributionId);
  }

  @Get('getImage/:imageName')
  async serveImage(@Param('imageName') imageName: string): Promise<string | null> {
    return this.contributionService.getImageData(imageName);
  }

  @Get('getFile/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response): void {
    const filePath = this.contributionService.getFilePath(filename);
    res.download(filePath, filename); // This will initiate the file download
  }

  @Post('updateStatus')
  updateStatus(@Body() updateStatusDto: UpdateStatusDto): Promise<Contribution> {
    return this.contributionService.updateContributionStatus(updateStatusDto);
  }

  @Post('updateComment')
  updateComment(@Body() updateCommentDto: UpdateCommentDto): Promise<Contribution> {
    return this.contributionService.updateComment(updateCommentDto);
  }

  @Post('getAllContributionPublished')
  async getAllContributionPublished(): Promise<Contribution[]> {
    return this.contributionService.getAllPublishedContributions();
  }

  @Post('getAllContributions')
  async getAllContributions(): Promise<Contribution[]> {
    return this.contributionService.getAllContributions();
  }

  @Post('getAllContributionsByYear/:year/:faculty_name')
  async getAllContributionsByYear(
    @Param('year') year: string,
    @Param('faculty_name') facultyName: string
  ): Promise<Contribution[]> {
    return this.contributionService.getAllContributionsByYear(year, facultyName);
  }

  @Post('getPublishContributionsByYear')
  async getPublishContributionsByYear(@Body('year') year: string): Promise<Contribution[]> {
    return this.contributionService.getPublishContributionsByYear(year);
  }

  @Get('statisticContributionPerYear/:year')
  async statisticContributionPerYear(@Param('year') year: string): Promise<any[]> {
    const data = await this.contributionService.statisticContributionPerYear(year);

    if (!data || data.length === 0) {
      return [];
    }

    return data;
  }

  @Get('statisticContributorsPerYear/:year')
  async statisticContributorsPerYear(@Param('year') year: string): Promise<any[]> {
    const data = await this.contributionService.statisticContributorsPerYear(year);

    if (!data || data.length === 0) {
      return [];
    }

    return data;
  }

  @Get('statisticContributionPerYearPerFaculty/:year/:faculty_name')
  async statisticContributionPerYearPerFaculty(
    @Param('year') year: string,
    @Param('faculty_name') facultyName: string
  ): Promise<any[]> {
    const data = await this.contributionService.statisticContributionPerYearPerFaculty(year, facultyName);

    if (!data || data.length === 0) {
      return [];
    }

    return data;
  }

}