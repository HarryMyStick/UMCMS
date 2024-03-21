import { IsNotEmpty } from 'class-validator';

export class AdminCreateUserDto {

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  faculty_id: string;

  @IsNotEmpty()
  role_id: string;
}
