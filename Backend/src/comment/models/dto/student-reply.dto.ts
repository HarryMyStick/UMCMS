import { IsNotEmpty } from 'class-validator';

export class StudentReplyDto {
  @IsNotEmpty()
  comment_id: string;

  @IsNotEmpty()
  student_reply: string;

  @IsNotEmpty()
  student_submission_date: Date;
}