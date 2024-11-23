import { Module } from '@nestjs/common';
import { CotizacionIndiceService } from './cotizacionIndice.service';
import { CotizacionIndiceController } from './cotizacionIndice.controller';
import { IndicesService } from '../Indice/indices.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionIndice } from './cotizacionIndice.entity';
import { Indice } from '../Indice/indice.entity';
import { IndicesController } from '../Indice/indices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CotizacionIndice, Indice])],
  controllers: [CotizacionIndiceController, IndicesController],
  providers: [CotizacionIndiceService, IndicesService],
  exports: [CotizacionIndiceService]
})
export class CotizacionIndiceModule {}
