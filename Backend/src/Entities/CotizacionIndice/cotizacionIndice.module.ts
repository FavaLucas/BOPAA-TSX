import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionIndiceService } from './cotizacionIndice.service';
import { CotizacionIndiceController } from './cotizacionIndice.controller';
import { IndicesService } from '../Indice/indices.services';
import { CotizacionIndice } from './cotizacionIndice.entity';
import { Indice } from '../Indice/indice.entity';
import { CotizacionesModule } from '../Cotizacion/cotizaciones.modules';
import { IndicesModule } from '../Indice/indices.modules';

@Module({
  imports: [TypeOrmModule.forFeature([CotizacionIndice, Indice]), CotizacionesModule, IndicesModule],
  controllers: [CotizacionIndiceController],
  providers: [CotizacionIndiceService],
  exports: [CotizacionIndiceService, TypeOrmModule],
})
export class CotizacionIndiceModule {}
