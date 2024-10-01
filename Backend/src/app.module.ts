import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CotizacionesController } from './controllers/cotizaciones.controller';
import { CotizacionesService } from './services/cotizaciones.services';
import { EmpresasController } from './controllers/empresas.controller';
import { EmpresasService } from './services/empresas.services';
import { IndicesController } from './controllers/indices.controller';
import { IndicesService } from './services/indices.services';

@Module({
  imports: [],
  controllers: [AppController, CotizacionesController, EmpresasController, IndicesController],
  providers: [AppService, CotizacionesService, EmpresasService, IndicesService],
})
export class AppModule {}
