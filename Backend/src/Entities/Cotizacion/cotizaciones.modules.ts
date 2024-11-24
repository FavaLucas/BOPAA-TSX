import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './cotizacion.entity';
import { CotizacionesController } from './cotizaciones.controller';
import { CotizacionesService } from './cotizaciones.services';
import { EmpresasController } from '../Empresa/empresas.controller';
import { EmpresasService } from '../Empresa/empresas.services';
import { Empresa } from '../Empresa/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cotizacion, Empresa])],
  controllers: [CotizacionesController, EmpresasController],
  providers: [CotizacionesService, EmpresasService],
  exports: [CotizacionesService, TypeOrmModule, CotizacionesModule],
})

export class CotizacionesModule {}