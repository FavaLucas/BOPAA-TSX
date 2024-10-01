import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import Cotizacion from "../models/Cotizacion.dto";
import { CotizacionesService } from "src/services/cotizaciones.services";


@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(private cotizacionesService: CotizacionesService) { }

  @Get()
  getCotizaciones(): Cotizacion[] {
    return this.cotizacionesService.getCotizaciones();
  }

}