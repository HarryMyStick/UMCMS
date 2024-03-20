import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  comment_id: string;

  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  comment_content: string;

  @IsNotEmpty()
  submission_date: Date;
  
  @IsOptional()
  student_submission_date: Date | null = null;

  @IsOptional()
  student_reply: string | null = null;
}