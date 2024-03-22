import { IsNotEmpty } from 'class-validator';

export class SendEmailDto {

  @IsNotEmpty()
  recipientEmail: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  message: string;
}
