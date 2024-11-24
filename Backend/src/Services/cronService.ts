import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CotizacionesService } from 'src/Entities/Cotizacion/cotizaciones.services';
import { EmpresasService } from 'src/Entities/Empresa/empresas.services';
import { CotizacionIndiceService } from 'src/Entities/CotizacionIndice/cotizacionIndice.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly empresaService: EmpresasService,
    private readonly cotizacionIndiceService: CotizacionIndiceService,
  ) {
    this.logger.log('Servicio Gen Data Inicializado');
  }

  @Cron('0 1 * * * *')
  async actualizarCotizacionesMisEmpresas() {
    this.logger.log("Cron - Actualizando cotizaciones en DB Local");

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

  @Cron('0 10 * * * *')
  async actualizarCotizacionesMisIndices() {
    this.logger.log("Cron - Actualizando cotizaciones de los índices en la DB Local");

    const arrIndicesEnDBLocal = await this.cotizacionIndiceService.buscarMisCodigosDeIndicesDeDB();
    if (arrIndicesEnDBLocal && arrIndicesEnDBLocal.length > 0) {
      for (const codigoIndice of arrIndicesEnDBLocal) {
        try {
          await this.cotizacionIndiceService.guardarTodasLasCotizaciones(codigoIndice);
        } catch (error) {
          this.logger.error(`CIS - Error al actualizar cotizaciones para el índice ${codigoIndice}: ${error.message}`);
        }
      }
    } else {
      this.logger.error("CIS - No hay índices en la DB local o la búsqueda falló");
    }
  }
}
