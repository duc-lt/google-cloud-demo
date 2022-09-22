class CreateFileDto {
  url: string;
  name: string;
}

export class CreateFilesDto {
  files: CreateFileDto;
}
