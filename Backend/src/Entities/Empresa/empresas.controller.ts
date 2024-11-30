import { Controller, Get, Param, Post, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { EmpresasService } from "src/Entities/Empresa/empresas.services";
import { Empresa } from "./empresa.entity";

@Controller('/empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) { }
  private readonly logger = new Logger(EmpresasController.name);

  //Retorna un arreglo con todos los codigos de las empresas de mi DB local
  //Postman: http://localhost:8080/empresas
  @Get()
  public async buscarMisEmpresasDeDB(): Promise<string[]> {
    // this.logger.log("EC - Buscando empresas en la base de datos");
    try {
      return await this.empresasService.buscarMisEmpresasDeDB();
    } catch (error) {
      this.logger.error(`Error al buscar empresas en la base de datos: ${error.message}`);
      throw new HttpException('Error al buscar empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Trae el detalle de la empresa desde Gempresa segun el codEmpresa que se indica
  //NO VA A GUARDAR los datos en local
  //Postman: http://localhost:8080/empresas/XOM
  @Get('/:codEmpresa')
  public getDetalleSegunCodEmpresaDesdeGempresa(@Param('codEmpresa') codEmpresa: string): Promise<Empresa> {
    // this.logger.log(`EC - Retorna el detalle de la empresa desde Gempresa correspondiente al codigo ${codEmpresa}`);
    return this.empresasService.getDetalleSegunCodEmpresaDesdeGempresa(codEmpresa);
  }

  //De acuerdo al codigo de empresa indicado:
  //Primero revisa si la empresa ya existe en mi DB local, si existe no la carga.
  //Si no existe, entonces la busca en Gempresa, la trae y la guarda en DB Local.
  //Postman: http://localhost:8080/empresas/guardar/TM
  @Post('/guardar/:codEmp')
  async guardarEmpresaEnDBLocal(@Param('codEmp') codEmpresa: string): Promise<Empresa> {
    // this.logger.log("EC - Guardar empresa en DB Local");
    return this.empresasService.guardarEmpresaEnDBLocal(codEmpresa);
  };

  //Solo busca el codigo de empresa indicado en mi base de datos local
  //Postman: http://localhost:8080/empresas/buscarEmpresaEnDBLocal/V
  @Get('/buscarEmpresaEnDBLocal/:codEmp')
  async buscarEmpresaEnDBLocal(@Param('codEmp') codEmp: string): Promise<Empresa | string | null> {
    try {
      const existe = await this.empresasService.buscarEmpresaEnDBLocal(codEmp);
      if (existe) {
        this.logger.log("EC - La empresa existe en la DB local");
        return existe;
      } else {
        this.logger.log("EC  - La empresa no existe en la DB Local");
      }
    } catch (error) {
      this.logger.error("EC - Error:", error.message);
    }
  }

  @Get('/traerDatos/DBLocalEmpresas')
  async traerDatosDeEmpresasDeDBLocal(): Promise<Empresa[]> {
    return await this.empresasService.traerDatosDeEmpresasDeDBLocal()
  }
}