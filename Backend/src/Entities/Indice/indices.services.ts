import { Injectable } from '@nestjs/common';
import { Indice } from './indice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { baseURL } from 'src/Services/AxiosAGempresa';
import clienteAxios, { AxiosResponse } from 'axios';



@Injectable()
export class IndicesService {

  private indices: Indice[] = [];

  constructor(
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>) { }

  public async getTodosLosIndicesDeGempresa(): Promise<Indice[]> {
    console.log("Get AllIndices");
    try {
      const indicesGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/indices`);
      return indicesGempresa.data;
    } catch (error) {
      console.error("No se encontraron indices para mostrar");
      throw error;
    }
  }

  /**
   * name
   */
  public async crearIndice() {
    
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

}


