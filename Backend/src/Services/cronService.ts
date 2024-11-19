
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CotizacionesService } from 'src/Entities/Cotizacion/cotizaciones.services';
import { CotizacionesController } from 'src/Entities/Cotizacion/cotizaciones.controller';


@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly cotizacionesController: CotizacionesController,
  ) {
    this.logger.log('Servicio Gen Data Inicializado');
  }


  @Cron('0 * * * * *')

  actualizarCotizaciones() {
    // this.logger.log("A ver que muestra");
    // this.cotizacionesController.actualizarCotizacionesMisEmpresas();
  }
}


