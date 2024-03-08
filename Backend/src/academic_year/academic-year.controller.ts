import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { CreateAcademicYearDto } from './models/dto/create-academic-year.dto';
import { AcademicYear } from './models/entities/academic-year.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AcademicYear')
@Controller('academicyear')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Post('createAcedemicYear') 
  createAcademicYear(@Body() createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    return this.academicYearService.createAcademicYear(createAcademicYearDto);
  }

  @Get('getAcademicYearByYear/:year')
  async getAcademicYearByYear(@Param('year') year: string): Promise<AcademicYear> {
    return this.academicYearService.getAcademicYearByYear(year);
  }
}