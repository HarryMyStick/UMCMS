import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  hospital: string;

  @IsNotEmpty()
  faculty: string;
}
