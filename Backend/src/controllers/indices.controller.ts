import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import Indice from "../models/Indice.dto";
import { IndicesService } from "src/services/indices.services";

@Controller('/indices')
export class IndicesController {
  constructor(private indicesService: IndicesService) { }

  @Get()
  getIndices(): Indice[] {
    return this.indicesService.getIndices();
  }

}