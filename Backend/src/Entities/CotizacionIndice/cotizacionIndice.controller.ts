import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CotizacionIndiceService } from './cotizacionIndice.service';
import { IndicesService } from '../Indice/indices.services';

@Controller('CotizacionIndice')
export class CotizacionIndiceController {
  constructor(
    private readonly cotizacionIndiceService: CotizacionIndiceService,
    private readonly indiceService: IndicesService,
  ) {}

  @Get('/hola')
  actualizarCotizacionesMisIndices() {
    return this.cotizacionIndiceService.actualizarCotizacionesMisIndices();
  }
}
