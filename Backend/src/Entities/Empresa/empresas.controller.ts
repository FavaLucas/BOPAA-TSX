import { Controller, Get, Param } from "@nestjs/common";
import { EmpresasService } from "src/Entities/Empresa/empresas.services";
import { Empresa } from "./empresa.entity";

@Controller('/empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) { }


  @Get()
  public buscarMisCodEmpresas(): Promise<Empresa[]> {
    console.log("Empresas back");
    return this.empresasService.buscarMisCodEmpresas();
  }

  @Get('/:codEmpresa')
  public getEmpresa(@Param('codEmpresa') codEmpresa: string): Promise<Empresa> {
    console.log("Empresas back");
    return this.empresasService.getEmpresa(codEmpresa);
  }

  @Get('/guardar/:codEmp')
  async guardarEmpresa(@Param('codEmp') codEmpresa: string): Promise<Empresa> {
    return this.empresasService.guardarEmpresa(codEmpresa);
  }

  // @Get('/find/:codEmp')
  // async buscarEmpresa(@Param('codEmp') codEmpresa: string): Promise<Empresa> {
  //   return this.empresasService.buscarEmpresa(codEmpresa);
  // }
}
