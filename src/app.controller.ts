import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHomePage(@Res() res: Response) {
    res.send(__dirname + 'index.html');
  }
}
