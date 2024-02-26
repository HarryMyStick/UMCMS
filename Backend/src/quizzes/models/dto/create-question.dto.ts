import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  quizId: string;

  @IsNotEmpty()
  questionText: string;

  @IsNotEmpty()
  questionType: string;
}
