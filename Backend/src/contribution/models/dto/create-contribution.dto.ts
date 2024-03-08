import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateContributionDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  article_title: string;

  @IsNotEmpty()
  article_description: string;

  @IsNotEmpty()
  article_content_url: string;

  @IsNotEmpty()
  submission_date: Date;

  @IsNotEmpty()
  edit_date: Date;

  @IsNotEmpty()
  isEnable: boolean;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  academic_year_id: string;
}