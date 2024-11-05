import { Body, Controller, Get, Param } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";

@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(private cotizacionesService: CotizacionesService) { }

  @Get('/:codEmpresa')
  public getCotizacionesByEmpresa(
    @Param('codEmpresa') codEmpresa: string, 
    @Body() body: {fechaDesde: string, fechaHasta: string}): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizacionesByEmpresa(codEmpresa, body.fechaDesde, body.fechaHasta);
  }

}