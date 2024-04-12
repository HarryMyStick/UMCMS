import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faculty } from './models/entities/faculty.entity';
import { Repository } from 'typeorm';
import { CreateFacultyDto } from './models/dto/create-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty) private facultyRepository: Repository<Faculty>,
  ) { }

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const { faculty_name } = createFacultyDto;

    const existingFaculty = await this.facultyRepository.findOne({
      where: [{ faculty_name }],
    });

    if (existingFaculty) {
      return existingFaculty;
    }

    const faculty = this.facultyRepository.create(createFacultyDto);
    await faculty.save();
    return faculty;
  }
  async updateFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const { faculty_id, faculty_name } = createFacultyDto;

    const existingFaculty = await this.facultyRepository.findOne({
      where: [{ faculty_id }],
    });

    const duplicateFaculty = await this.facultyRepository.findOne({
      where: [{ faculty_name }],
    });

    if (duplicateFaculty) {
      throw new ConflictException('Duplicate Faculty');
    }

    if (existingFaculty && !duplicateFaculty) {
      existingFaculty.faculty_name = faculty_name;
      await existingFaculty.save();
      return existingFaculty;
    }
  }
  
  async deleteFaculty(faculty_id: string): Promise<void> {
    const faculty = await this.facultyRepository.findOne({
      where: [{ faculty_id: faculty_id }],
    });
    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }
    await this.facultyRepository.remove(faculty);
  }

  async getFacultyById(faculty_id: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne({
      where: { faculty_id: faculty_id },
    });
    if (!faculty) {
      throw new NotFoundException('Role not found');
    }
    return faculty;
  }

  async getFacultyByName(faculty_name: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne({
      where: { faculty_name: faculty_name },
    });
    if (!faculty) {
      throw new NotFoundException('Role not found');
    }
    return faculty;
  }

  async getAllFaculty(): Promise<Faculty[]> {
    return this.facultyRepository.find();
  }
}
