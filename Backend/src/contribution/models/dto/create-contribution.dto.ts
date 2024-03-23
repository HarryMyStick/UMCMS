import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

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

  @IsOptional()
  image_url: string = 'default_image_url';

  @IsOptional()
  comment: string = 'not comment';

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