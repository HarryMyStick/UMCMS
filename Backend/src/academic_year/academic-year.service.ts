import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYear } from './models/entities/academic-year.entity';
import { Repository } from 'typeorm';
import { CreateAcademicYearDto } from './models/dto/create-academic-year.dto';

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
}
