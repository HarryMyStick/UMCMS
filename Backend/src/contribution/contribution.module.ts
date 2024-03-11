import { Module } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './models/entities/contribution.entity';
import { User } from 'src/users/models/entities/user.entity';
import { AcademicYear } from 'src/academic_year/models/entities/academic-year.entity';
import { UsersModule } from 'src/users/users.module';
import { AcademicYearModule } from 'src/academic_year/academic-year.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, User, AcademicYear]),
    UsersModule,
    AcademicYearModule,
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/img',
      rootPath: process.env.NODE_ENV === 'production'
        ? '/contribution/uploads/img/' // Adjust this path for production
        : join(__dirname, '..', '..', 'uploads', 'img'), // Relative path for development
    }),
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}