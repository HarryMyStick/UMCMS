import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './models/entities/comment.entity';
import { Contribution } from 'src/contribution/models/entities/contribution.entity';
import { ContributionModule } from 'src/contribution/contribution.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Contribution]),
    ContributionModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}