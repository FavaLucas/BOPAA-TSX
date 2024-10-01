import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import Empresa from "../models/Empresa.dto";
import { EmpresasService } from "src/services/empresas.services";


@Controller('/empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) { }

  @Get()
  getEmpresas(): Empresa[] {
    return this.empresasService.getEmpresas();
  }

}