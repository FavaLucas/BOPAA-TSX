import { Controller, Get } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";



@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(private cotizacionesService: CotizacionesService) { }

  @Get()
  public getAllCotizaciones(): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getAllCotizaciones();
  }

}