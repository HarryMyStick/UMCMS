import { IsNotEmpty } from 'class-validator';

export class UpdateAcademicYearDto {
  @IsNotEmpty()
  academic_year_id: string;

  @IsNotEmpty()
  closure_date: Date;

  @IsNotEmpty()
  final_closure_date: Date;
}
