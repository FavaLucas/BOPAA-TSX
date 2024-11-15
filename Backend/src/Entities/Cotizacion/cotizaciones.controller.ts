import { Body, Controller, Get, Param, Query, Logger } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";
import { EmpresasService } from "../Empresa/empresas.services";

@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(
    private cotizacionesService: CotizacionesService,
    private empresaService: EmpresasService,
  ) { }
  private readonly logger = new Logger(CotizacionesController.name);

  //Trae todas las cotizaciones guardadas en mi DB Local
  //Postman: http://localhost:8080/cotizaciones/
  @Get()
  public getCotizaciones(): Promise<Cotizacion[]> {
    this.logger.log("CC - Obteniendo todas las cotizaciones");
    return this.cotizacionesService.getCotizaciones();
  }

  //Ingreso con fechaDesde y hasta de tipo: 2024-11-14T00:00
  //http://localhost:8080/cotizaciones/entreFechas/V?fechaDesde=2024-11-01T00:00&fechaHasta=2021-11-14T20:00
  @Get('/entreFechas/:codEmpresa')
  public getCotizacionesEntreFechas(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string): Promise<Cotizacion[]> {
    this.logger.log(`CC - Obteniendo cotizaciones desde Gempresa de la empresa ${codEmpresa} entre ${fechaDesde} y ${fechaHasta}`);
    return this.cotizacionesService.getCotizacionesEntreFechas(codEmpresa, fechaDesde, fechaHasta);
  }





































  @Get('fechayhora/:codEmpresa')
  public getCotizacionesUTCFechaYHora(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string): Promise<Cotizacion[]> {
    this.logger.log(`CotizacionesController - Obteniendo cotizacion de la empresa ${codEmpresa} el dia ${fecha} a la hora ${hora}`);
    return this.cotizacionesService.getCotizacionesFechaYHora(codEmpresa, fecha, hora);
  }

  //El metodo no me esta trayendo todas las ultimas cotizaciones.
  @Get('/traerCotizacionesMisEmpresas')
  public async getLastCotizacion(): Promise<void> {
    this.logger.log("CotizacionesController - Actualizando cotizaciones en DB Local");
    const arrCodigosEmpresas = await this.empresaService.buscarMisEmpresasDeDB();
    //A partir de los codEmpresa de nuestra DB vamos a buscar que cotizaciones nos falta.
    //Pueden ser todas desde todas 0 o las que falten desde el ultimo ingreso a hoy.
    for (const codEmpresa of arrCodigosEmpresas) {
      await this.cotizacionesService.guardarTodasLasCotizaciones(codEmpresa);
    }
  }
}