import { Controller, Get} from "@nestjs/common";
import { IndicesService } from "src/Entities/Indice/indices.services";
import { Indice } from "./indice.entity";

@Controller('/indices')
export class IndicesController {
  constructor(private indicesService: IndicesService) { }

  @Get()
  public getAllIndices(): Promise<Indice[]> {
    console.log("Indices back");
    return this.indicesService.getAllIndices();
  }
}