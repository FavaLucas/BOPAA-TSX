import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CotizacionesController } from './controllers/cotizaciones.controller';
import { CotizacionesService } from './services/cotizaciones.services';

@Module({
  imports: [],
  controllers: [AppController, CotizacionesController],
  providers: [AppService, CotizacionesService],
})
export class AppModule {}
