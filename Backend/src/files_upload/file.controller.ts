import { Controller, Post, Body } from '@nestjs/common';
import { FileService } from './file.service';
import { UploadFileDto } from './models/dto/upload-file.dto';
import { File } from './models/entities/file.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FilesUpload')
@Controller('filesupload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('uploadFile') 
  uploadFile(@Body() uploadFileDto: UploadFileDto): Promise<File> {
    return this.fileService.uploadFile(uploadFileDto);
  }
}