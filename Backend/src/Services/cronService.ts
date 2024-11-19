
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CotizacionesService } from 'src/Entities/Cotizacion/cotizaciones.services';
import { CotizacionesController } from 'src/Entities/Cotizacion/cotizaciones.controller';
import { EmpresasService } from 'src/Entities/Empresa/empresas.services';


@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly empresaService: EmpresasService,
  ) {
    this.logger.log('Servicio Gen Data Inicializado');
  }


  @Cron('50 0 * * * *')

  async actualizarCotizacionesMisEmpresas() {
    this.logger.log("CotizacionesController - Actualizando cotizaciones en DB Local");

    const arrCodigosEmpresas = await this.empresaService.buscarMisEmpresasDeDB();
    if (arrCodigosEmpresas && arrCodigosEmpresas.length > 0) {
      for (const codEmpresa of arrCodigosEmpresas) {
        try {
          await this.cotizacionesService.guardarTodasLasCotizaciones(codEmpresa);
        } catch (error) {
          this.logger.error(`Error al actualizar cotizaciones para la empresa ${codEmpresa}: ${error.message}`);
        }
      }
    } else {
      this.logger.warn("No hay empresas en su DB Local o la búsqueda falló");
    }
  }
}


