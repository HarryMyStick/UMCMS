// app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors'; // Update the import statement

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';
import { FacultyModule } from './faculty/faculty.module';
import { ContributionModule } from './contribution/contribution.module';
import { AcademicYearModule } from './academic_year/academic-year.module';
import { CommentModule } from './comment/comment.module';
import { MessageModule } from './websockets/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Adjust entity path as per your structure
      synchronize: true,
    }),
    UsersModule,
    RoleModule,
    ProfileModule,
    FacultyModule,
    ContributionModule,
    AcademicYearModule,
    CommentModule,
    MessageModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors())
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(bodyParser.json({ limit: '10mb' }))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
