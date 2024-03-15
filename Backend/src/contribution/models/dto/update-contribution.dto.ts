import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateContributionDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  article_title: string;

  @IsNotEmpty()
  article_description: string;

  @IsOptional()
  article_content_url: string;

  @IsOptional()
  image_url: string = 'default_image_url';

  @IsNotEmpty()
  submission_date: Date;

  @IsNotEmpty()
  edit_date: Date;

  @IsNotEmpty()
  academic_year_id: string;
}