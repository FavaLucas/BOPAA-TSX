import { Controller, Get, Post } from "@nestjs/common";
import { IndicesService } from "src/Entities/Indice/indices.services";
import { Indice } from "./indice.entity";

@Controller('/indices')
export class IndicesController {
  constructor(private indicesService: IndicesService) { }

  @Get()
  public getTodosLosIndicesDeGempresa(): Promise<Indice[]> {
    console.log("Indices back");
    return this.indicesService.getTodosLosIndicesDeGempresa();
  }

  @Post()
  public crearIndice() {
    return this.crearIndice()
  }

//   @Post()
//   public subirNuevoValorDeIndiceCadaHoraAGempresa(): void {
//     this.indicesService.subirNuevoValorDeIndiceCadaHoraAGempresa();
//   }
}