import { IsNotEmpty } from 'class-validator';

export class CreateContributionDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  article_title: string;

  @IsNotEmpty()
  article_content: string;

  @IsNotEmpty()
  submission_date: Date;

  @IsNotEmpty()
  edit_date: Date;

  @IsNotEmpty()
  isEnable: boolean;

  @IsNotEmpty()
  isSelected: boolean;
}