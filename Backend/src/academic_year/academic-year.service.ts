import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYear } from './models/entities/academic-year.entity';
import { Repository } from 'typeorm';
import { CreateAcademicYearDto } from './models/dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './models/dto/update-academic-year.dto';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYear) private academicYearRepository: Repository<AcademicYear>,
  ) { }

  async createAcademicYear(createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    const { academic_year } = createAcademicYearDto;

    const existingYear = await this.academicYearRepository.findOne({
      where: [{ academic_year }],
    });

    if (existingYear) {
      return existingYear;
    }

    const academicYear = this.academicYearRepository.create(createAcademicYearDto);
    await academicYear.save();
    return academicYear;
  }

  async getAcademicYearByYear(year: string): Promise<AcademicYear> {
    const academicYear = await this.academicYearRepository.findOne({
      where: { academic_year: year },
    });
    if (!academicYear) {
      throw new NotFoundException('Role not found');
    }
    return academicYear;
  }

  async getAllAcademicYear(): Promise<AcademicYear[]> {
    return this.academicYearRepository.find();
  }

  async updateAcadamicYear(updateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
    const { closure_date, final_closure_date } = updateAcademicYearDto;

    const academicYear = await this.academicYearRepository.findOne({
      where: { academic_year_id: updateAcademicYearDto.academic_year_id },
    });
    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    academicYear.closure_date = closure_date;
    academicYear.final_closure_date = final_closure_date;

    await this.academicYearRepository.save(academicYear);
    return academicYear;
  }
}
