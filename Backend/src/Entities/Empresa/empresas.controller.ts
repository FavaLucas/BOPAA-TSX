import { Controller, Get } from "@nestjs/common";
import { EmpresasService } from "src/Entities/Empresa/empresas.services";
import { Empresa } from "./empresa.entity";
import { IEmpresa } from "./IEmpresa";

@Controller('/empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) { }

  @Get()
  public getAllEmpresas():Promise<Empresa[]> {
    console.log("Empresas back");
    return this.empresasService.getAllEmpresas();
  }

  @Get('/mock')
  public getEmpresasMock():Promise<IEmpresa[]> {
    console.log("Controller Empresas-Mock");
    return this.empresasService.getEmpresasMock();
  }

}