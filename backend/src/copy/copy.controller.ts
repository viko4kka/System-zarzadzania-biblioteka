import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CopyService } from './copy.service';
import type { Request } from 'express';

@Controller('copy')
export class CopyController {
  constructor(
    private readonly authService: AuthService,
    private readonly copyService: CopyService,
  ) {}

  @Get(':id_book')
  async getBookCopies(
    @Req() req: Request,
    @Param('id_book') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const payload = await this.authService.verifyToken(req);
    if (payload.is_Admin !== true) {
      throw new ForbiddenException('Tylko administrator może wyświetlać kopie');
    }

    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 100;
    return this.copyService.getBookCopies(
      parseInt(id),
      pageNumber,
      limitNumber,
    );
  }

  @Post('add/:id_book')
  async addCopy(@Req() req: Request, @Param('id_book') id: string) {
    const payload = await this.authService.verifyToken(req);
    if (payload.is_Admin !== true) {
      throw new ForbiddenException('Tylko administrator może dodawać kopie');
    }
    return this.copyService.addCopy(parseInt(id));
  }

  @Patch('remove/:id_copy')
  async removeCopy(@Req() req: Request, @Param('id_copy') id: string) {
    const payload = await this.authService.verifyToken(req);
    if (payload.is_Admin !== true) {
      throw new ForbiddenException('Tylko administrator może usuwać kopie');
    }
    return this.copyService.removeCopy(parseInt(id));
  }
}
