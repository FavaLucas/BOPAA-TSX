import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './cotizacion.entity';
import { CotizacionesController } from './cotizaciones.controller';
import { CotizacionesService } from './cotizaciones.services';


@Module({
  imports: [TypeOrmModule.forFeature([Cotizacion])],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
})

export class CotizacionesModule {}