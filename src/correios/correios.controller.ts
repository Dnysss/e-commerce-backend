import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCepExternalDTO } from './dtos/return-cep-external.dto';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/:cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCepExternalDTO> {
    return this.correiosService.findAddressByCep(cep);
  }
}
