import { IsNotEmpty } from 'class-validator';

export class ForgotPassDto {

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  password: string;
}
