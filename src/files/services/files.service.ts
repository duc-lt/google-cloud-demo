import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StorageService } from 'src/storage/storage.service';
import { CreateFilesDto } from '../dto/create-files.dto';
import { File, FileDocument } from '../schemas/file.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly storageService: StorageService,
  ) {}

  async findAll() {
    return this.fileModel.find({}).lean();
  }

  async findOne(id: string) {
    return this.fileModel.findById(id).lean();
  }

  async create(createFilesDto: CreateFilesDto) {
    return this.fileModel.create(createFilesDto);
  }

  async remove(id: string) {
    const file = await this.fileModel.findById(id).lean();
    await this.storageService.delete(file.name);
    return this.fileModel.findByIdAndRemove(id);
  }
}
