import { Body, Controller, Post } from "@nestjs/common";
import { SendEmailDto } from "./models/dto/send-email.dto";
import { MailService } from "./mail.service";

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendEmailDto: SendEmailDto): Promise<string> {
    return this.mailService.sendEmail(sendEmailDto);
  }

}