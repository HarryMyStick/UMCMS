import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  hospital: string;

  @IsNotEmpty()
  faculty: string;
}
