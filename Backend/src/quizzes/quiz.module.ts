import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { UsersController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [UsersController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
