import { Controller, Get,  HttpException,  HttpStatus,  Logger } from "@nestjs/common";
import { IndicesService } from "./indices.services";
import { Indice } from "./indice.entity";

@Controller('indices')
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) { }

  private readonly logger = new Logger(IndicesController.name);


  //IMPORTANTE
  //Postman: http://localhost:8080/indices/
  //Esto llevarlo a CRON para que automaticamente se busquen todos los indices de GEMPRESA y se guarden en mi DB Local
  @Get()
  public async actualizarIndicesDesdeGempresa(): Promise<void> {
    this.logger.log("IC - Obteniendo todos los índices");
    return this.indicesService.actualizarIndicesDesdeGempresa();
  }

  @Get('/traerDatos/DBLocalIndice') 
  async traerDatosDBLocalIndice(): Promise<Indice[]>  {
      return this.indicesService.traerDatosDBLocalIndice();   
  }

  @Get("/traerCodigosDeIndices")
  public async buscarCodigosDeIndicesDeDB(): Promise<string[]> {
    this.logger.log("IC - Buscando codigos de mis indices en la base de datos");
    try {
      return await this.indicesService.buscarCodigosDeIndicesDeDB();
    } catch (error) {
      this.logger.error(`Error al buscar empresas en la base de datos: ${error.message}`);
      throw new HttpException('Error al buscar empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
}
