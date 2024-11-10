import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";
import { EmpresasService } from "../Empresa/empresas.services";

@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(private cotizacionesService: CotizacionesService, private empresaService: EmpresasService) { }

  @Get()
  public getCotizaciones(): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizaciones();
  }

  @Get('/UTC/:codEmpresa')
  public getCotizacionesUTCByEmpresaEntreFechas(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizacionesByEmpresaEntreFechas(codEmpresa, fechaDesde, fechaHasta);
  }

  @Get('/:codEmpresa/cotizacion')
  public getCotizacionesUTCFechaYHora(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizacionesFechaYHora(codEmpresa, fecha, hora);
  }


  @Get('/traerCotizacionesMisEmpresas')
  public async getLastCotizacion(): Promise<void> {

    const arrCodigosEmpresas = await this.empresaService.buscarMisCodEmpresas();
    //A partir de los codEmpresa de nuestra DB vamos a buscar que cotizaciones nos falta.
    //Pueden ser todas desde todas 0 o las que falten desde el ultimo ingreso a hoy.
    for (const codEmpresa of arrCodigosEmpresas) {
      await this.cotizacionesService.guardarTodasLasCotizaciones(codEmpresa);
    }
  }



}



