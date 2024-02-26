import { Controller, Post, Body, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuestionDto } from './models/dto/create-question.dto';
import { Question } from './models/entities/question.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Quiz')
@Controller('question')
export class UsersController {
  constructor(private readonly questionService: QuizService) {}

  @Post()
  createQuestion(@Body() createUserDto: CreateQuestionDto): Promise<Question> {
    return this.questionService.createUser(createUserDto);
  }

  @Get()
  getQuestions(@Body() createUserDto: CreateQuestionDto): Promise<Question> {
    return this.questionService.createUser(createUserDto);
  }
}
