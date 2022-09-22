import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { fileUploadOptions } from '../configs/files.config';
import { CreateFilesDto } from '../dto/create-files.dto';
import { FilesService } from '../services/files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly storageService: StorageService,
    private readonly filesService: FilesService,
  ) {}

  @Get('/:fileName')
  async find(@Param('fileName') fileName: string) {
    await this.storageService.download(fileName);
    return {
      success: true,
    };
  }

  @Get()
  async findAll() {
    return await this.filesService.findAll();
  }

  @Post()
  async create(@Body() createFilesDto: CreateFilesDto) {
    const files = await this.filesService.create(createFilesDto);
    return { files };
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5, fileUploadOptions))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.storageService.uploadMultiple(files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

  }
}
