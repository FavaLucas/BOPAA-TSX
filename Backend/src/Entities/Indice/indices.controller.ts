import { Controller, Get, Query, Logger } from "@nestjs/common";
import { Indice } from "./indice.entity";
import { IndicesService } from "./indices.services";

@Controller('indices')
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) {}

  private readonly logger = new Logger(IndicesController.name);

  @Get()
  public async getIndices(): Promise<Indice[]> {
    this.logger.log("IC - Obteniendo todos los índices");
    return this.indicesService.getIndices();
  }

  @Get('/entreFechas')
  public async getIndicesEntreFechas(
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string
  ): Promise<Indice[]> {
    this.logger.log(`IC - Obteniendo índices desde ${fechaDesde} hasta ${fechaHasta}`);
    return this.indicesService.getIndicesEntreFechas(fechaDesde, fechaHasta);
  }
}
