import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Indice } from './indice.entity';

import DateMomentsUtils from 'src/utils/DateMomentsUtils';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';
import { CotizacionIndice } from '../CotizacionIndice/entities/cotizacionIndice.entity';

@Injectable()
export class IndicesService {
  constructor(
    @InjectRepository(Indice) private readonly indicesRepository: Repository<Indice>,
    @InjectRepository(CotizacionIndice) private readonly cotizacionIndiceRepository: Repository<CotizacionIndice>,
  ) { }

  private readonly logger = new Logger(IndicesService.name);

  // Obtener todos los índices guardados en la base de datos local
  public async getIndices(): Promise<Indice[]> {
    this.logger.log("IS - Obteniendo todos los índices");
    return this.indicesRepository.find();
  }

  // Obtener índices entre fechas específicas
  public async getIndicesEntreFechas(fechaDesde: string, fechaHasta: string): Promise<Indice[]> {
    this.logger.log(`IS - Obteniendo índices desde ${fechaDesde} hasta ${fechaHasta}`);

    const fechaDesdeUTC = DateMomentsUtils.transformarFechaAGMT(fechaDesde.split("T")[0], fechaDesde.split("T")[1]);
    const fechaHastaUTC = DateMomentsUtils.transformarFechaAGMT(fechaHasta.split("T")[0], fechaHasta.split("T")[1]);

    const respuestaGempresa: AxiosResponse<any, any> = await axios.get(`${baseURL}/indices?fechaDesde=${fechaDesdeUTC.fecha}T${fechaDesdeUTC.hora}&fechaHasta=${fechaHastaUTC.fecha}T${fechaHastaUTC.hora}`);
    const indices = respuestaGempresa.data.map(indice => {
      const fechaLocal = DateMomentsUtils.transformarFechaAGMT(indice.fecha, indice.hora);
      return new Indice(indice.id, indice.codigoIndice, indice.nombreIndice, indice.valorFinalIndice);
    });

    await this.indicesRepository.save(indices);
    return indices;
  }

  // Guardar un índice en la base de datos
  public async guardarIndiceEnDB(indice: Indice): Promise<Indice> {
    try {
      return this.indicesRepository.save(indice);
    } catch (error) {
      this.logger.error("Error guardando el índice:", error);
      throw error;
    }
  }
}


// //implementar el calculo = 10
// public async calcularIndiceCadaHora(): Promise<number> {
//   //traigo todas las cotizaciones de mis empresas en esta hora y calculo el indice XXXXXX
//   const resultado = 0
//   return resultado;
// }

// public async guardarValorCalculadoDelIndiceEnMiDB(resultadoActual: number) {
//   const resultado: iIndice = {
//     id: resultadoActual.id,
//     fecha: resultadoActual.fecha,
//     hora: resultadoActual.hora,
//     codigoIndice: resultadoActual.codigoIndice,
//     nombre: resultadoActual.nombre,
//   }
//   this.indiceRepository.save(resultado);
// }


// public async guardarValorDelIndiceEnGEMPRESA(resultadoActual) {
//   //ir a la url de  jose .push(resultadoActual)
//   const resultado: iIndice = {
//     id: resultadoActual.id,
//     fecha: resultadoActual.fecha,
//     hora: resultadoActual.hora,
//     codigoIndice: resultadoActual.codigoIndice,
//     nombre: resultadoActual.nombre,
//   }
//   URLDEJOSE.save(resultado);
// }

// ///////////////////////////////////////////////////////////
// public async subirNuevoValorDeIndiceCadaHoraAGempresa() {
//   const resultadoActual = await calcularIndiceCadaHora();

//   await this.guardarValorCalculadoDelIndiceEnMiDB(resultadoActual);
//   await this.guardarValorDelIndiceEnGEMPRESA(resultadoActual);
//   return 0;
// }

/**
 * QUiero publicar cada hora el nuevo valor de mi indice, pasos
 * 1-Calcular el indice (revisar calculo)
 * 2-Guardar el resultado en mi DB
 * 3-Crear el indice para dicho resultado
 * 
 * 
 */



