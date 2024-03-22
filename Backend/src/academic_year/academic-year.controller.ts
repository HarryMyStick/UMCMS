import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { CreateAcademicYearDto } from './models/dto/create-academic-year.dto';
import { AcademicYear } from './models/entities/academic-year.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAcademicYearDto } from './models/dto/update-academic-year.dto';

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

  @Get('getAllAcademicYear')
  async getAllAcademicYear(): Promise<AcademicYear[]> {
    return this.academicYearService.getAllAcademicYear();
  }

  @Post('updateAcadamicYear') 
  updateAcadamicYear(@Body() UpdateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
    return this.academicYearService.updateAcadamicYear(UpdateAcademicYearDto);
  }

  @Post('deleteYear/:academic_year_id')
  async deleteYear(@Param('academic_year_id') academic_year_id: string): Promise<void> {
    return this.academicYearService.deleteYear(academic_year_id);
  }

}