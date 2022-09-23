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
    return this.bucket.getFiles();
  }

  private async uploadSingle(file: Express.Multer.File) {
    const res = await this.bucket.upload(file.path);
    return { url: res[0].metadata.mediaLink, name: res[0].metadata.name };
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file) => {
        return this.uploadSingle(file);
      }),
    );
  }

  async download(filename: string) {
    return this.bucket.file(filename).download({
      destination: `/home/${userInfo().username}/${filename}`,
    });
  }

  async delete(filename: string) {
    await this.bucket.file(filename).delete({ ignoreNotFound: true });
  }
}
