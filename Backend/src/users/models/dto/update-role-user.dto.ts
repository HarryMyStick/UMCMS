import { IsNotEmpty } from 'class-validator';

export class UpdateRoleUserDto {

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  role_name: string;
}
