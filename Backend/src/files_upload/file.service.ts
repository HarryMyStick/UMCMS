import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './models/entities/file.entity';
import { Repository } from 'typeorm';
import { UploadFileDto } from './models/dto/upload-file.dto';
import { Contribution } from 'src/contribution/models/entities/contribution.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(Contribution) private contributionRepository: Repository<Contribution>,
  ) { }

  async uploadFile(uploadFileDto: UploadFileDto): Promise<File> {
    const { contribution_id, image_url } = uploadFileDto;

    const existingFile = await this.fileRepository.findOne({
      where: { image_url },
    });

    if (existingFile) {
      return existingFile;
    }

    const contribution = await this.contributionRepository.findOne({
      where: { contribution_id: contribution_id },
    });
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    const file = this.fileRepository.create({
      ...uploadFileDto,
      contribution: contribution,
    });
    await file.save();
    return file;
  }
}
