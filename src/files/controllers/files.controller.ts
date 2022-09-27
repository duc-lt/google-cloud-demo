import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { userInfo } from 'os';
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

  @Get()
  async findAll() {
    return await this.storageService.findAll();
  }

  @Get('download')
  async find(@Query('filename') filename: string, @Res() response: Response) {
    await this.storageService.download(filename);
    response.download(`/home/${userInfo().username}/${filename}`);
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

  @Delete('single')
  async removeSingle(@Query('filename') filename: string) {
    await this.storageService.deleteSingle(filename);
    return {
      success: true,
    };
  }

  @Delete('multiple')
  async removeMultiple(@Query('filename') filenames: string[] | string) {
    Array.isArray(filenames)
      ? await this.storageService.deleteMultiple(filenames)
      : await this.storageService.deleteSingle(filenames);
    return {
      success: true,
    };
  }
}
