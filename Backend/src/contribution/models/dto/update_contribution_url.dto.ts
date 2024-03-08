import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class UpdateContributionUrlDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  image_url: string;
}