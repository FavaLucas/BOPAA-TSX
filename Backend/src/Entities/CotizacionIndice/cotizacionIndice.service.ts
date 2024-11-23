import { Injectable, Logger } from '@nestjs/common';
import { CotizacionIndice } from './cotizacionIndice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Indice } from '../Indice/indice.entity';
import DateMomentsUtils from 'src/utils/DateMomentsUtils';
import { IFecha } from 'src/Models/fecha.model';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';

@Injectable()
export class CotizacionIndiceService {
  constructor(
    @InjectRepository(CotizacionIndice) private readonly cotizacionIndiceRepository: Repository<CotizacionIndice>,
    @InjectRepository(Indice) private readonly indiceRepository: Repository<Indice>) { }

  private readonly logger = new Logger(CotizacionIndiceService.name);

  public async buscarMisCodigosDeIndicesDeDB(): Promise<string[]> {
    this.logger.log("CIS - Obteniendo Codigos de Indices de mi DB Local");
    const empresas = await this.indiceRepository.find({ select: ["codigoIndice"] });
    return empresas.map(empresa => empresa.codigoIndice);
  }

  public async actualizarCotizacionesMisIndices() {
    this.logger.log("CIS - Actualizando cotizaciones de los indices en DB Local");
    const arrIndicesEnDBLocal = await this.buscarMisCodigosDeIndicesDeDB();
    this.logger.log("CIS - Se buscaran las cotizaciones de los Indices: ", arrIndicesEnDBLocal);
    if (arrIndicesEnDBLocal && arrIndicesEnDBLocal.length > 0) {
      for (const codigoIndice of arrIndicesEnDBLocal) {
        try {
          await this.guardarTodasLasCotizaciones(codigoIndice);
        } catch (error) {
          this.logger.error(`CIS - Error al actualizar cotizaciones para el índice ${codigoIndice}: ${error.message}`);
        }
      }
    } else {
      this.logger.error("CIS - No hay índices en su DB Local o la búsqueda falló");
    }
  }

  public async guardarTodasLasCotizaciones(codigoIndice: string): Promise<void> {
    this.logger.log(`CIS - Actualizando cotizaciones para el índice ${codigoIndice}`);

    // Obtener la última fecha de cotización en la base de datos
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codigoIndice);
    this.logger.log(`CIS - Última fecha en mi DB: ${JSON.stringify(ultimaFechaEnMiDB)}`);
    const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);
    this.logger.log(`CIS - String última fecha en mi DB: ${stringUltimaFechaEnMiDB}`);

    // Obtener la última fecha registrada en Gempresa
    const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
    this.logger.log(`CIS - Última fecha en Gempresa: ${ultimaFechaGempresa}`);
    const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);
    this.logger.log(`CIS - String última fecha en Gempresa: ${stringUltimaFechaDeGempresa}`);

    try {
      const cotizaciones = await this.getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(
        codigoIndice,
        stringUltimaFechaEnMiDB,
        stringUltimaFechaDeGempresa,
      );

      this.logger.log(`CIS - Cotizaciones procesadas para ${codigoIndice}: ${cotizaciones.length}`);
    } catch (error) {
      this.logger.error(`CIS - Error al guardar cotizaciones para el índice ${codigoIndice}: ${error.message}`);
    }
  }

  public async ultimaFechaDeCotizacionEnMiDB(codigoIndice: string): Promise<IFecha> {
    try {
      this.logger.log('CIS - Buscando última cotización para el código de índice:', codigoIndice);
      const empresa = await this.indiceRepository.findOne({ where: { codigoIndice } });

      const ultimaCotizacion = await this.cotizacionIndiceRepository.createQueryBuilder('cotizacion')
        .leftJoinAndSelect('cotizacion.codigoIndice', 'indice')
        .where('indice.codigoIndice = :codigoIndice', { codigoIndice })
        .orderBy('cotizacion.id', 'DESC')
        .getOne();

      if (!ultimaCotizacion) {
        //Seteamos fecha por defecto en caso de no tener datos
        return DateMomentsUtils.transformarFechaAGMT('2024-01-01', '00:00');
      } else {
        return DateMomentsUtils.transformarFechaAGMT(ultimaCotizacion.fecha, ultimaCotizacion.hora);
      }

    } catch (error) {
      this.logger.debug("CIS - Error al buscar la última cotización:", error);
      throw error;
    }
  }

  public async ultimaFechaRegistradaEnGempresa(): Promise<IFecha> {
    return DateMomentsUtils.getUltimaFechaCotizacionGempresa();
  }

  public async getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codigoIndice: string, stringUltimaFechaEnMiDB: string, stringUltimaFechaDeGempresa: string): Promise<CotizacionIndice[]> {
    this.logger.log(`CIS - Actualizando cotizaciones de ${codigoIndice} desde ${stringUltimaFechaEnMiDB} hasta ${stringUltimaFechaDeGempresa}`);
  
    const indice = await this.indiceRepository.findOne({ where: { codigoIndice } });
  
    const url = `${baseURL}/indices/${codigoIndice}/cotizaciones?fechaDesde=${encodeURIComponent(stringUltimaFechaEnMiDB)}&fechaHasta=${encodeURIComponent(stringUltimaFechaDeGempresa)}`;
    this.logger.debug(`CIS - URL formada para la API externa: ${url}`);
    const respuesta: AxiosResponse<any, any> = await axios.get(url);
  
    this.logger.log(`CIS - Respuesta de Gempresa: ${JSON.stringify(respuesta.data)}`);
  
    const horarioDeBolsaUTC = [
      "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00"
    ];
  
    this.logger.log(`CIS - Horario de Bolsa en UTC: ${JSON.stringify(horarioDeBolsaUTC)}`);
  
    const cotizacionesFaltantes = await Promise.all(respuesta.data.map(async (cotizacion) => {
      const fechaUTC = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);
    
      this.logger.log(`CIS - Procesando cotización: Fecha UTC=${fechaUTC.fecha}, Hora UTC=${fechaUTC.hora}`);
    
      if (horarioDeBolsaUTC.includes(fechaUTC.hora)) {
        const nuevaCotizacionIndice = new CotizacionIndice(
          fechaUTC.fecha,
          fechaUTC.hora,
          cotizacion.valor, 
          indice
        );
    
        this.logger.debug(`CIS - Guardando cotización: ${JSON.stringify(nuevaCotizacionIndice)}`);
    
        await this.guardarCotizacionEnDB(nuevaCotizacionIndice);
      } else {
        this.logger.warn(`CIS - Cotización fuera de horario: ${JSON.stringify(fechaUTC)}`);
      }
    }));
  
    await Promise.all(cotizacionesFaltantes);
    this.logger.log(`CIS - Procesamiento completado para ${codigoIndice}`);
    return respuesta.data;
  }
  
  public async guardarCotizacionEnDB(cotizacionIndice: CotizacionIndice): Promise<CotizacionIndice> {
    try {
      this.logger.debug("CIS - Intentando guardar la cotización:", JSON.stringify(cotizacionIndice));
      const hayCotizacion = await this.cotizacionIndiceRepository.findOne({
        where: {
          fecha: cotizacionIndice.fecha,
          hora: cotizacionIndice.hora,
          codigoIndice: { codigoIndice: cotizacionIndice.codigoIndice.codigoIndice } // Ajuste aquí
        }
      });
      if (!hayCotizacion) {
        this.logger.debug("CIS - No se encontró cotización existente, guardando nueva cotización");
        return this.cotizacionIndiceRepository.save(cotizacionIndice);
      } else {
        this.logger.log("CIS - La cotización ya existe en la base de datos");
      }
    } catch (error) {
      this.logger.error("CIS - Error guardando la cotización:", error);
      throw error;
    }
  }
  
  public async buscarCotizacionPorID(cotizacionIndice: CotizacionIndice): Promise<CotizacionIndice> {
    try {
      return this.cotizacionIndiceRepository.findOne({
        where: {
          fecha: cotizacionIndice.fecha,
          hora: cotizacionIndice.hora,
          codigoIndice: { codigoIndice: cotizacionIndice.codigoIndice.codigoIndice } // Ajuste aquí
        }
      });
    } catch (error) {
      this.logger.error("CIS - Error buscando cotización:", error);
      throw error;
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
}
