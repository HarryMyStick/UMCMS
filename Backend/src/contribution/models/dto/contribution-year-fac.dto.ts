import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class ContributionYearFacDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  year: string;

  @IsNotEmpty()
  faculty_name: string;
}