import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { randomBytes } from 'crypto';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const fileUploadOptions: MulterOptions = {
  storage: diskStorage({
    filename(req, file, callback) {
      // const extension = extname(file.originalname);
      // const filename = `${randomBytes(19).toString('hex')}${extension}`;
      // callback(null, filename);
      callback(null, file.originalname);
    },
  }),
};

export const MAX_FILE_COUNT = 5;
