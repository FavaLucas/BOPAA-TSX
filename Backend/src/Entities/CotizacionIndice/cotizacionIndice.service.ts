import { Injectable } from '@nestjs/common';
import { CreateCotizacionIndiceDto } from './dto/create-cotizacion-indice.dto';
import { UpdateCotizacionIndiceDto } from './dto/update-cotizacion-indice.dto';

@Injectable()
export class CotizacionIndiceService {
  create(createCotizacionIndiceDto: CreateCotizacionIndiceDto) {
    return 'This action adds a new cotizacionIndice';
  }
  

  findAll() {
    return `This action returns all cotizacionIndice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cotizacionIndice`;
  }

  update(id: number, updateCotizacionIndiceDto: UpdateCotizacionIndiceDto) {
    return `This action updates a #${id} cotizacionIndice`;
  }

  remove(id: number) {
    return `This action removes a #${id} cotizacionIndice`;
  }
}
