import { Controller, Get, Param } from "@nestjs/common";
import { EmpresasService } from "src/Entities/Empresa/empresas.services";
import { Empresa } from "./empresa.entity";

@Controller('/empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) { }

  @Get()
  public getAllEmpresas(): Promise<Empresa[]> {
    console.log("Empresas back");
    return this.empresasService.getAllEmpresas();
  }

  @Get('/:codEmpresa')
  public getEmpresa(@Param('codEmpresa') codEmpresa: string): Promise<Empresa> {
    console.log("Empresas back");
    return this.empresasService.getEmpresa(codEmpresa);
  }

  @Get('/save/:codEmp')
  async guardarEmpresa(@Param('codEmp') codEmpresa: string): Promise<Empresa> {
    return this.empresasService.guardarEmpresa(codEmpresa);
  }

  // @Get('/find/:codEmp')
  // async buscarEmpresa(@Param('codEmp') codEmpresa: string): Promise<Empresa> {
  //   return this.empresasService.buscarEmpresa(codEmpresa);
  // }
}
