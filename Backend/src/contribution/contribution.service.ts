import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from './models/entities/contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './models/dto/create-contribution.dto';
import { User } from 'src/users/models/entities/user.entity';
import { AcademicYear } from 'src/academic_year/models/entities/academic-year.entity';
import { UpdateStatusDto } from './models/dto/update-status.dto';
import { UpdateContributionUrlDto } from './models/dto/update-contribution_url.dto';
import * as path from 'path';
import * as fs from 'fs';
import { join } from 'path';
import { ContributionYearFacDto } from './models/dto/contribution-year-fac.dto';
import { UpdateContributionDto } from './models/dto/update-contribution.dto';
import { ContributionYearFacUDto } from './models/dto/contribution-year-fac-u.dto';
import { UpdateCommentDto } from './models/dto/update-comment.dto';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution) private contributionRepository: Repository<Contribution>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AcademicYear) private academicYearRepository: Repository<AcademicYear>,
  ) { }

  async createContribution(createContributionDto: CreateContributionDto): Promise<Contribution> {
    const { user_id, academic_year_id, ...contributionData } = createContributionDto;

    const user = await this.userRepository.findOne({
      where: [{ user_id: user_id }],
    });
    if (!user) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const academicYear = await this.academicYearRepository.findOne({
      where: [{ academic_year_id: academic_year_id }],
    });
    if (!academicYear) {
      throw new Error(`Academic year with ID ${academic_year_id} not found`);
    }

    const contribution = this.contributionRepository.create({
      ...contributionData,
      user_id: user,
      academic_year_id: academicYear,
    });

    await contribution.save();
    return contribution;
  }

  async updateImageContribution(updateContributionUrlDto: UpdateContributionUrlDto): Promise<Contribution> {
    const cont = await this.contributionRepository.findOne({
      where: [{ contribution_id: updateContributionUrlDto.contribution_id }],
    });
    if (!cont) {
      throw new Error(`Contribution with id ${updateContributionUrlDto.contribution_id} not found`);
    }

    // Update the image_url field of the contribution entity
    cont.image_url = updateContributionUrlDto.image_url;

    // Save the updated contribution entity
    await this.contributionRepository.save(cont);

    return cont;
  }

  async getPublishContributionsByFacultyName(facultyName: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .where('f.faculty_name = :facultyName', { facultyName })
      .andWhere('sc.status = :status', { status: 'Published' })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getPublishContributionsByFacultyNameAndByYear(contributionYearFacDto: ContributionYearFacDto): Promise<Contribution[]> {
    const { faculty_name, year } = contributionYearFacDto;

    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .innerJoin('sc.academic_year_id', 'ay')
      .where('f.faculty_name = :facultyName', { facultyName: faculty_name })
      .andWhere('ay.academic_year = :academicYear', { academicYear: year })
      .andWhere('sc.status = :status', { status: 'Published' })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getContributionsByFacultyNameAndByYear(contributionYearFacDto: ContributionYearFacDto): Promise<Contribution[]> {
    const { faculty_name, year } = contributionYearFacDto;

    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .innerJoin('sc.academic_year_id', 'ay')
      .where('f.faculty_name = :facultyName', { facultyName: faculty_name })
      .andWhere('sc.status <> :status', { status: 'Published' })
      .andWhere('ay.academic_year = :academicYear', { academicYear: year })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getContributionsByFacultyNameByYearByUserId(contributionYearFacUto: ContributionYearFacUDto): Promise<Contribution[]> {
    const { faculty_name, year, user_id } = contributionYearFacUto;

    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .innerJoin('sc.academic_year_id', 'ay')
      .where('f.faculty_name = :facultyName', { facultyName: faculty_name })
      .andWhere('sc.status <> :status', { status: 'Published' })
      .andWhere('ay.academic_year = :academicYear', { academicYear: year })
      .andWhere('u.user_id = :userId', { userId: user_id })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getContributionsByFacultyName(facultyName: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .where('f.faculty_name = :facultyName', { facultyName })
      .andWhere('sc.status <> :status', { status: 'Published' })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getContributionsByFacultyNameApprove(facultyName: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .where('f.faculty_name = :facultyName', { facultyName })
      .andWhere('sc.status IN (:...statuses)', { statuses: ['Approved', 'Published'] })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getAllContributionsByFacultyName(facultyName: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .where('f.faculty_name = :facultyName', { facultyName })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getContributionViaUserId(userId: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .leftJoinAndSelect('sc.user_id', 'user')
      .where('user.user_id = :userId', { userId })
      .getRawMany();
  }

  async updateContribution(updateContributionDto: UpdateContributionDto): Promise<Contribution> {
    const contribution = await this.contributionRepository.findOne({
      where: { contribution_id: updateContributionDto.contribution_id },
      relations: ['user_id', 'academic_year_id'],
    });

    if (!contribution) {
      throw new Error(`Contribution with id ${updateContributionDto.contribution_id} not found`);
    }

    contribution.article_title = updateContributionDto.article_title;
    contribution.article_description = updateContributionDto.article_description;
    if (contribution.article_content_url !== "") {
      contribution.article_content_url = updateContributionDto.article_content_url;
    }
    contribution.submission_date = updateContributionDto.submission_date;
    contribution.edit_date = updateContributionDto.edit_date;

    if (updateContributionDto.user_id) {
      const user = await this.userRepository.findOne({
        where: { user_id: updateContributionDto.user_id },
      });
      if (!user) {
        throw new Error(`User with id ${updateContributionDto.user_id} not found`);
      }
      contribution.user_id = user;
    }

    if (updateContributionDto.academic_year_id) {
      // Assuming academic_year_id is a string representing the academic year's ID
      const academicYear = await this.academicYearRepository.findOne({
        where: { academic_year_id: updateContributionDto.academic_year_id },
      });
      if (!academicYear) {
        throw new Error(`Academic year with id ${updateContributionDto.academic_year_id} not found`);
      }
      contribution.academic_year_id = academicYear;
    }

    // Save the updated contribution entity
    await this.contributionRepository.save(contribution);

    return contribution;
  }

  async deleteContribution(contributionId: string): Promise<void> {
    const contribution = await this.contributionRepository.findOne({
      where: [{ contribution_id: contributionId }],
    });
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }
    await this.contributionRepository.remove(contribution);
  }

  async getImageData(imageName: string): Promise<string | null> {
    const imagePath = join(__dirname, '..', '..', '..', 'Backend', 'src', 'contribution', 'uploads', 'img', imageName);

    return new Promise((resolve, reject) => {
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          const base64Image = Buffer.from(data).toString('base64');
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          resolve(imageUrl);
        }
      });
    });
  }

  getFilePath(filename: string): string {
    // Assuming the files are stored in the 'uploads' directory
    const filePath = path.join(__dirname, '..', '..', '..', 'Backend', 'src', 'contribution', 'uploads', filename);
    return filePath;
  }

  async updateContributionStatus(updateStatusDto: UpdateStatusDto): Promise<Contribution> {
    const contribution = await this.contributionRepository.findOne({
      where: [{ contribution_id: updateStatusDto.contribution_id }],
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }
    contribution.status = updateStatusDto.status;
    const updatedContribution = await contribution.save();

    return updatedContribution;
  }

  async updateComment(updateCommentDto: UpdateCommentDto): Promise<Contribution> {
    const contribution = await this.contributionRepository.findOne({
      where: [{ contribution_id: updateCommentDto.contribution_id }],
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }
    contribution.comment = updateCommentDto.comment;
    const updatedContribution = await contribution.save();

    return updatedContribution;
  }

  async getAllPublishedContributions(): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .where('sc.status = :status', { status: 'Published' })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getAllContributions(): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getPublishContributionsByYear(year: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .innerJoin('sc.academic_year_id', 'ay')
      .where('ay.academic_year = :academicYear', { academicYear: year })
      .andWhere('sc.status = :status', { status: 'Published' })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async getAllContributionsByYear(year: string): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder('sc')
      .innerJoin('sc.user_id', 'u')
      .innerJoin('u.faculty', 'f')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .innerJoin('sc.academic_year_id', 'ay')
      .where('ay.academic_year = :academicYear', { academicYear: year })
      .addSelect(['sc', 'sc.user_id'])
      .addSelect(['sc', 'p.first_name', 'p.last_name'])
      .getRawMany();
  }

  async statisticContributionPerYear(year: string): Promise<any[]> {
    try {
      const statistics = await this.contributionRepository
        .createQueryBuilder('contribution')
        .select('academic_year.academic_year', 'academicYear')
        .addSelect('faculty.faculty_name', 'facultyName')
        .addSelect('COUNT(contribution.contribution_id)', 'contributionCount')
        .innerJoin('contribution.academic_year_id', 'academic_year')
        .innerJoin('contribution.user_id', 'user')
        .innerJoin('user.faculty', 'faculty')
        .where('contribution.status = :status', { status: 'Published' })
        .andWhere('academic_year.academic_year = :year', { year })
        .groupBy('academic_year.academic_year')
        .addGroupBy('faculty.faculty_name')
        .orderBy('academic_year.academic_year')
        .addOrderBy('faculty.faculty_name')
        .getRawMany();

      return statistics;
    } catch (error) {
      throw new Error(`Unable to fetch contribution statistics: ${error.message}`);
    }
  }

  async statisticContributorsPerYear(year: string): Promise<any[]> {
    try {
      const statistics = await this.contributionRepository
        .createQueryBuilder('contribution')
        .select('academic_year.academic_year', 'academicYear')
        .addSelect('faculty.faculty_name', 'facultyName')
        .addSelect('COUNT(DISTINCT user.user_id)', 'contributorCount') // Count distinct users (contributors)
        .innerJoin('contribution.academic_year_id', 'academic_year')
        .innerJoin('contribution.user_id', 'user')
        .innerJoin('user.faculty', 'faculty')
        .where('contribution.status = :status', { status: 'Published' })
        .andWhere('academic_year.academic_year = :year', { year })
        .groupBy('academic_year.academic_year')
        .addGroupBy('faculty.faculty_name')
        .orderBy('academic_year.academic_year')
        .addOrderBy('faculty.faculty_name')
        .getRawMany();

      return statistics;
    } catch (error) {
      throw new Error(`Unable to fetch contributor statistics: ${error.message}`);
    }
  }
  
  async statisticContributionPerYearPerFaculty(year: string, facultyName: string): Promise<any[]> {
    try {
      const statistics = await this.contributionRepository
        .createQueryBuilder('contribution')
        .select([
          'faculty.faculty_name AS facultyName',
          'COUNT(CASE WHEN contribution.status IN (:...statuses) THEN 1 ELSE NULL END) AS approvedCount',
          'COUNT(contribution.contribution_id) AS totalCount',
        ])
        .innerJoin('contribution.user_id', 'user')
        .innerJoin('user.faculty', 'faculty')
        .innerJoin('contribution.academic_year_id', 'academic_year')
        .where('faculty.faculty_name = :facultyName', { facultyName })
        .andWhere('academic_year.academic_year = :year', { year })
        .groupBy('faculty.faculty_name')
        .setParameters({ statuses: ['Approved', 'Published'] })
        .getRawOne();
      return statistics;
    } catch (error) {
      throw new Error(`Unable to fetch contribution statistics: ${error.message}`);
    }
  }

}
