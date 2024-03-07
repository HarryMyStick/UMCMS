import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './models/entities/file.entity';
import { Contribution } from 'src/contribution/models/entities/contribution.entity';
import { ContributionModule } from 'src/contribution/contribution.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Contribution]),
    ContributionModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
