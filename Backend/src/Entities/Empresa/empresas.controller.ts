import { Controller, Get, Param } from "@nestjs/common";
import { EmpresasService } from "src/Entities/Empresa/empresas.services";
import { Empresa } from "./empresa.entity";

@Controller('/empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) { }

  @Get('/:codEmpresa')
  public getEmpresa(@Param('codEmpresa') codEmpresa: string):Promise<Empresa> {
    console.log("Empresas back");
    return this.empresasService.getEmpresa(codEmpresa);
  }
}