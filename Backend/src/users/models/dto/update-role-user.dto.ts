import { IsNotEmpty } from 'class-validator';

export class UpdateRoleUserDto {

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  faculty_name: string;

  @IsNotEmpty()
  role_name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  profile_id: string;
}
