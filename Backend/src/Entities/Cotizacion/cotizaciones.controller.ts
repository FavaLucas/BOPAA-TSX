import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";

@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(private cotizacionesService: CotizacionesService) { }

  @Get('/:codEmpresa')
  public getCotizacionesByEmpresa(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizacionesByEmpresa(codEmpresa, fechaDesde, fechaHasta);
  }

  @Get('/:codEmpresa/cotizacion')
  public getCotizacionesFechaYHora(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizacionesFechaYHora(codEmpresa, fecha, hora);
  }
}



