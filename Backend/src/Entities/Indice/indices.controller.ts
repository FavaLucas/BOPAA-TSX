import { Controller, Get, Query, Logger, Post } from "@nestjs/common";
import { IndicesService } from "./indices.services";

@Controller('indices')
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) {}

  private readonly logger = new Logger(IndicesController.name);


  //IMPORTANTE
  //Postman: http://localhost:8080/indices/
  //Esto llevarlo a CRON para que automaticamente se busquen todos los indices de GEMPRESA y se guarden en mi DB Local
  @Get()
  public async getIndicesGempresa(): Promise<void> {
    this.logger.log("IC - Obteniendo todos los índices");
    return this.indicesService.getIndicesGempresa();
  }
}
