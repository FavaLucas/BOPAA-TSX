import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CotizacionIndiceService } from './cotizacionIndice.service';
import { CreateCotizacionIndiceDto } from './dto/create-cotizacion-indice.dto';
import { UpdateCotizacionIndiceDto } from './dto/update-cotizacion-indice.dto';

@Controller('CotizacionIndice')
export class CotizacionIndiceController {
  constructor(private readonly cotizacionIndiceService: CotizacionIndiceService) {}

  @Post()
  create(@Body() createCotizacionIndiceDto: CreateCotizacionIndiceDto) {
    return this.cotizacionIndiceService.create(createCotizacionIndiceDto);
  }

  @Get()
  findAll() {
    return this.cotizacionIndiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotizacionIndiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCotizacionIndiceDto: UpdateCotizacionIndiceDto) {
    return this.cotizacionIndiceService.update(+id, updateCotizacionIndiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotizacionIndiceService.remove(+id);
  }
}
