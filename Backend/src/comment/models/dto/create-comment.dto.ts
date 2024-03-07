import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  comment_id: string;

  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  comment: string;
}
