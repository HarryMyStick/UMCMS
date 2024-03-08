import { Module } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './models/entities/contribution.entity';
import { User } from 'src/users/models/entities/user.entity';
import { AcademicYear } from 'src/academic_year/models/entities/academic-year.entity';
import { UsersModule } from 'src/users/users.module';
import { AcademicYearModule } from 'src/academic_year/academic-year.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, User, AcademicYear]),
    UsersModule,
    AcademicYearModule,
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}
