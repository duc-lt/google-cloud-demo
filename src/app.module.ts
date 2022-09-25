import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import { StorageModule } from './storage/storage.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    FilesModule,
    StorageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
