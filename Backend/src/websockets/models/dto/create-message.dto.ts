import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  text: string;
}
