import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  comment: string;
}