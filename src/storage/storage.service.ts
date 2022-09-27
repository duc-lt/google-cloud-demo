import { Injectable } from '@nestjs/common';
import { Storage, Bucket } from '@google-cloud/storage';
import { userInfo } from 'os';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
    });

    this.bucket = this.storage.bucket(process.env.STORAGE_BUCKET);
  }

  async findAll() {
    const files = await this.bucket.getFiles();
    return files[0].map((file) => ({
      name: file.metadata.name,
    }));
  }

  private async uploadSingle(file: Express.Multer.File) {
    const res = await this.bucket.upload(file.path);
    return { url: res[0].metadata.mediaLink, name: res[0].metadata.name };
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file) => {
        return await this.uploadSingle(file);
      }),
    );
  }

  async download(filename: string) {
    return this.bucket.file(filename).download({
      destination: `/home/${userInfo().username}/${filename}`,
    });
  }

  async deleteSingle(filename: string) {
    await this.bucket.file(filename).delete({ ignoreNotFound: true });
  }

  async deleteMultiple(filenames: string[]) {
    Promise.all(filenames.map(async (filename) => {
      return await this.deleteSingle(filename);
    }));
  }
}
