import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';
import { CotizacionIndice } from '../CotizacionIndice/cotizacionIndice.entity';
import { Indice } from './indice.entity';

@Injectable()
export class IndicesService {
  constructor(
    @InjectRepository(Indice) private readonly indicesRepository: Repository<Indice>,
    @InjectRepository(CotizacionIndice) private readonly cotizacionIndiceRepository: Repository<CotizacionIndice>,
  ) { }

  private readonly logger = new Logger(IndicesService.name);

  public async actualizarIndicesDesdeGempresa(): Promise<void> {
    const todosLosIndicesDeGempresa: AxiosResponse<any, any> = await axios.get(`${baseURL}/indices`);
    // this.logger.log("IS - Indices obtenidos de Gempresa", todosLosIndicesDeGempresa.data);
    const arregloDeIndices = todosLosIndicesDeGempresa.data.filter(aux => aux.code && aux.name).map(async (aux) => {
      const nuevoIndice = new Indice(
        aux.code,
        aux.name,
        aux.__v
      )
      // this.logger.log(`IS - Indice ${nuevoIndice.nombreIndice} guardado en DB Local`);
      await this.guardarIndiceEnDB(nuevoIndice);
    })
    await Promise.all(arregloDeIndices);
  }

  public async traerDatosDBLocalIndice(): Promise<Indice[]>{
    return this.indicesRepository.find()
  }

  public async guardarIndiceEnDB(indice: Indice): Promise<Indice> {
    const indiceExisteEnDBLocal = await this.indicesRepository.findOne(
      {
        where: { codigoIndice: indice.codigoIndice }
      })
    try {
      if (indiceExisteEnDBLocal == null) {
        return this.indicesRepository.save(indice);
      }
    } catch (error) {
      this.logger.error("Error guardando el índice:", error);
      throw error;
    }
  }


  public async buscarCodigosDeIndicesDeDB(): Promise<string[]> {
    // this.logger.log("ES - Obteniendo codEmpresas[] de mi DB Local");
    const indices = await this.indicesRepository.find({ select: ["codigoIndice"] });
    return indices.map(indice => indice.codigoIndice);
  };

  
}


