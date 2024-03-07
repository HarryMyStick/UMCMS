import { IsNotEmpty } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty()
  faculty_id: string;

  @IsNotEmpty()
  faculty_name: string;
}
