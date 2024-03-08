import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { UploadFileDto } from './models/dto/upload-file.dto';
import { File } from './models/entities/file.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import fs from 'fs';

@ApiTags('FilesUpload')
@Controller('filesupload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('uploadFile') 
  @UseInterceptors(FileInterceptor('image')) 
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
    const uploadFolder = 'uploads';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    const imageUrl = filePath; 

    const uploadFileDto: UploadFileDto = {
      file_id: file.filename, 
      contribution_id: '',
      image_url: imageUrl,
    };

    return this.fileService.uploadFile(uploadFileDto);
  }
}