import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class ContributionYearFacUDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  year: string;

  @IsNotEmpty()
  faculty_name: string;

  @IsNotEmpty()
  user_id: string;
}