import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './models/dto/create-faculty.dto';
import { Faculty } from './models/entities/faculty.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post('createFaculty') 
  createFaculty(@Body() createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return this.facultyService.createFaculty(createFacultyDto);
  }

  @Post('updateFaculty') 
  updateFaculty(@Body() createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return this.facultyService.updateFaculty(createFacultyDto);
  }
  
  @Post('deleteFaculty/:faculty_id')
  async deleteYear(@Param('faculty_id') faculty_id: string): Promise<void> {
    return this.facultyService.deleteFaculty(faculty_id);
  }

  @Get('getFacultyById/:faculty_id')
  async getFacultyById(@Param('faculty_id') faculty_id: string): Promise<Faculty> {
    return this.facultyService.getFacultyById(faculty_id);
  }

  @Get('getFacultyByName/:faculty_name')
  async getFacultyByName(@Param('faculty_name') faculty_name: string): Promise<Faculty> {
    return this.facultyService.getFacultyByName(faculty_name);
  }
  
  @Get('getAllFaculty')
  async getAllFaculty(): Promise<Faculty[]> {
    return this.facultyService.getAllFaculty();
  }

}