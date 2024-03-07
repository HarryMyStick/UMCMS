import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  file_id: string;

  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  image_url: string;
}
