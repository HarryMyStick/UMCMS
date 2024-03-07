import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';
import { FacultyModule } from './faculty/faculty.module';
import { ContributionModule } from './contribution/contribution.module';
import { FileModule } from './files_upload/file.module';
import { CommentModule } from './comment/comment.module';
import { AcademicYearModule } from './academic_year/academic-year.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', //process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    UsersModule,
    RoleModule,
    ProfileModule,
    FacultyModule,
    ContributionModule,
    FileModule,
    CommentModule,
    AcademicYearModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
