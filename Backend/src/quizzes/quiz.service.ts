import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './models/entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './models/dto/create-question.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Question)
    private questionsRepositiry: Repository<Question>,
  ) {}

  async createUser(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const user = await this.questionsRepositiry.create(createQuestionDto);
    await user.save();

    return user;
  }

  async getQuestion(): Promise<Question[]> {
    const user = await this.questionsRepositiry.find();
    return user;
  }

  // async findUserByName(name: string) {
  //   return await Question.findOne({
  //     where: {
  //       name: name,
  //     },
  //   });
  // }
}
