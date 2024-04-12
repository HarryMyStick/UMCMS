import { IsNotEmpty } from 'class-validator';

export class ValidateDto {

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;
}
