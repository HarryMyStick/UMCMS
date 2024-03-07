import { IsNotEmpty } from 'class-validator';

export class CreateAcademicYearDto {
  @IsNotEmpty()
  academic_year_id: string;

  @IsNotEmpty()
  academic_year: string;

  @IsNotEmpty()
  closure_date: Date;

  @IsNotEmpty()
  final_closure_date: Date;
}
