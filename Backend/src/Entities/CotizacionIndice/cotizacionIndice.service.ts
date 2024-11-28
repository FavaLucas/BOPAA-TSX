import { Injectable, Logger } from '@nestjs/common';
import { CotizacionIndice } from './cotizacionIndice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Indice } from '../Indice/indice.entity';
import DateMomentsUtils from 'src/utils/DateMomentsUtils';
import { IFecha } from 'src/Models/fecha.model';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';
import { CotizacionesService } from '../Cotizacion/cotizaciones.services';

@Injectable()
export class CotizacionIndiceService {
  private readonly logger = new Logger(CotizacionIndiceService.name);

  constructor(
    @InjectRepository(CotizacionIndice)
    private readonly cotizacionIndiceRepository: Repository<CotizacionIndice>,
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>,
    private readonly cotizacionesService: CotizacionesService,

  ) { }

  public async traerDatosDBLocalCotizacionIndice(): Promise<CotizacionIndice[]>{
    return this.cotizacionIndiceRepository.find()
  }

  public async buscarMisCodigosDeIndicesDeDB(): Promise<string[]> {
    const IndiceBursatil = await this.indiceRepository.find({ select: ["codigoIndice"] });
    return IndiceBursatil.map(Indice => Indice.codigoIndice);
  }

  public async guardarTodasLasCotizaciones(codigoIndice: string): Promise<void> {
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codigoIndice);
    const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);

    const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
    const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);

    try {
      await this.getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(
        codigoIndice,
        stringUltimaFechaEnMiDB,
        stringUltimaFechaDeGempresa,
      );
    } catch (error) {
      this.logger.error(`CIS - Error al guardar cotizaciones para el índice ${codigoIndice}: ${error.message}`);
    }
  }

  public async ultimaFechaDeCotizacionEnMiDB(codigoIndice: string): Promise<IFecha> {
    try {
      const ultimaCotizacion = await this.cotizacionIndiceRepository.createQueryBuilder('cotizacion')
        .leftJoinAndSelect('cotizacion.codigoIndice', 'indice')
        .where('indice.codigoIndice = :codigoIndice', { codigoIndice })
        .orderBy('cotizacion.id', 'DESC')
        .getOne();

      if (!ultimaCotizacion) {
        return DateMomentsUtils.transformarFechaAGMT('2024-01-01', '00:00');
      } else {
        return DateMomentsUtils.transformarFechaAGMT(ultimaCotizacion.fecha, ultimaCotizacion.hora);
      }
    } catch (error) {
      this.logger.error("CIS - Error al buscar la última cotización:", error);
      throw error;
    }
  }

  public async ultimaFechaRegistradaEnGempresa(): Promise<IFecha> {
    return DateMomentsUtils.getUltimaFechaCotizacionGempresa();
  }

  public async getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codigoIndice: string, stringUltimaFechaEnMiDB: string, stringUltimaFechaDeGempresa: string): Promise<CotizacionIndice[]> {

    const indice = await this.indiceRepository.findOne({ where: { codigoIndice } });

    if (!indice) {
      this.logger.error(`Índice no encontrado para el código ${codigoIndice}`);
      return [];
    }

    const respuesta: AxiosResponse<any, any> = await axios.get(`${baseURL}/indices/${indice.codigoIndice}/cotizaciones?fechaDesde=${(stringUltimaFechaEnMiDB)}&fechaHasta=${(stringUltimaFechaDeGempresa)}`);

    const horarioDeBolsaUTC = [
      "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00"
    ];

    const cotizacionesFaltantes = await Promise.all(respuesta.data.map(async (cotizacion) => {

      this.logger.log(`Procesando cotización: Fecha UTC=${cotizacion.fecha}, Hora UTC=${cotizacion.hora}`);

      if (horarioDeBolsaUTC.includes(cotizacion.hora)) {
        const nuevaCotizacionIndice = new CotizacionIndice(
          cotizacion.fecha,
          cotizacion.hora,
          cotizacion.valor,
          indice)

        await this.guardarCotizacionEnDB(nuevaCotizacionIndice);
      }
    }));

    return cotizacionesFaltantes;
  }

  public async guardarCotizacionEnDB(cotizacionIndice: CotizacionIndice): Promise<CotizacionIndice> {
    try {
      const hayCotizacion = await this.cotizacionIndiceRepository.findOne({
        where: {
          fecha: cotizacionIndice.fecha,
          hora: cotizacionIndice.hora,
          codigoIndice: { id: cotizacionIndice.codigoIndice.id }
        }
      });

      if (!hayCotizacion) {
        return this.cotizacionIndiceRepository.save(cotizacionIndice);
      } else {
        this.logger.warn(`La cotización ya existe para la fecha ${cotizacionIndice.fecha} y hora ${cotizacionIndice.hora}.`);
        return hayCotizacion;
      }
    } catch (error) {
      this.logger.error("CIS - Error guardando la cotización:", error);
      throw error;
    }
  }

  public async actualizarCotizacionesMisIndices() {
    const arrIndicesEnDBLocal = await this.buscarMisCodigosDeIndicesDeDB();
    if (arrIndicesEnDBLocal && arrIndicesEnDBLocal.length > 0) {
      for (const codigoIndice of arrIndicesEnDBLocal) {
        try {
          await this.guardarTodasLasCotizaciones(codigoIndice);
        } catch (error) {
          this.logger.error(`CIS - Error al actualizar cotizaciones para el índice ${codigoIndice}: ${error.message}`);
        }
      }
    } else {
      this.logger.error("CIS - No hay índices en la DB local o la búsqueda falló");
    }
  }


  public async obtenerTodasLasCotizaciones(): Promise<CotizacionIndice[]> {
    try {
      return this.cotizacionIndiceRepository.find();
    } catch (error) {
      this.logger.error("CIS - Error obteniendo todas las cotizaciones:", error);
      throw error;
    }
  }

  async calcularIndice(): Promise<void> {
    const cotizaciones = await this.cotizacionesService.obtenerTodasLasCotizaciones();
    this.logger.log(`Número de cotizaciones obtenidas: ${cotizaciones.length}`);

    const cotizacionesPorDiaYHora = {};

    cotizaciones.forEach(cotizacion => {
      const valorCotizacion = Number(cotizacion.cotizacion);
      if (isNaN(valorCotizacion)) {
        this.logger.error(`Cotización no válida: ${JSON.stringify(cotizacion)}`);
        return;
      }

      const fechaHora = `${cotizacion.fecha} ${cotizacion.hora}`;
      if (!cotizacionesPorDiaYHora[fechaHora]) {
        cotizacionesPorDiaYHora[fechaHora] = {
          valores: [],
          fecha: cotizacion.fecha,
          hora: cotizacion.hora
        };
      }
      cotizacionesPorDiaYHora[fechaHora].valores.push(valorCotizacion);
    });

    for (const fechaHora of Object.keys(cotizacionesPorDiaYHora)) {
      const grupo = cotizacionesPorDiaYHora[fechaHora];
      const sumaCotizaciones = grupo.valores.reduce((acc, curr) => acc + curr, 0);
      const promedio = sumaCotizaciones / grupo.valores.length;

      const valorLimitado = parseFloat((promedio).toFixed(2));

      const existeEnGempresa = await this.verificarIndiceEnGempresa(grupo.fecha, grupo.hora, "TSX");
      const existeEnBaseDeDatos = await this.verificarCotizacionEnBaseDeDatos(grupo.fecha, grupo.hora, "TSX");

      if (!existeEnGempresa && !existeEnBaseDeDatos) {
        const indiceTSX = await this.indiceRepository.findOne({ where: { codigoIndice: 'TSX' } });
        const cotizacionIndice = new CotizacionIndice(grupo.fecha, grupo.hora, valorLimitado, indiceTSX)
        await this.cotizacionIndiceRepository.save(cotizacionIndice)
        await this.publicarIndiceEnGempresa(grupo.fecha, grupo.hora, "TSX", valorLimitado);
      } else {
        // this.logger.warn(`El índice TSX ya existe para la fecha ${grupo.fecha} y hora ${grupo.hora}, no se guardará ni publicará de nuevo.`);
      }
    }
  }

  async publicarIndiceEnGempresa(fecha: string, hora: string, codigoIndice: string, indice: number): Promise<any> {
    const data = {
      fecha,
      hora,
      codigoIndice,
      valorIndice: indice,
    };
    const url = "http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones"
    try {
      // this.logger.debug(data, "puclicar indice")
      const response = await axios.post(url, data);
      this.logger.log(`Índice ${codigoIndice} publicado en Gempresa`);
      return response.data
    } catch (error) {
      this.logger.error(`Error al publicar el índice ${codigoIndice} en Gempresa: ${error.message}`);
    }
  }

  async verificarIndiceEnGempresa(fecha: string, hora: string, codigoIndice: string): Promise<boolean> {
    const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones/${codigoIndice}?fecha=${fecha}&hora=${hora}`;
    try {
      const response = await axios.get(url);
      return response.data.length > 0; 
    } catch (error) { 
      // this.logger.error(`Error al verificar el índice ${codigoIndice} en Gempresa: ${error.message}`);
      return false; 
    }
  }

  async verificarCotizacionEnBaseDeDatos(fecha: string, hora: string, codigoIndice: string): Promise<boolean> {
    const cotizacionExistente = await this.cotizacionIndiceRepository.findOne({
      where: {
        fecha: fecha,
        hora: hora,
        codigoIndice: { codigoIndice } 
      }
    });
    return cotizacionExistente !== null; 
  }

  public async getFiltrarCotizaciones(codIndice: string): Promise<CotizacionIndice[]> {
    try {
      const cotizacionesIndice = await this.cotizacionIndiceRepository.find({
        relations: ['codigoIndice'], 
        where: {
          codigoIndice: {codigoIndice: codIndice},
        }
      });
      console.log("Cotizacion Indice", cotizacionesIndice)
      return Promise.all(cotizacionesIndice)
    } catch (error) {
      console.error("Error al filtrar cotizaciones por codIndice: ", error);
      throw new Error("No se pudo obtener las cotizaciones del Indice");
    }
  }
}


