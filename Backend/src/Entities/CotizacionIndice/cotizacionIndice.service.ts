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
    this.logger.log("ES - Obteniendo codEmpresas[] de mi DB Local");
    const empresas = await this.indiceRepository.find({ select: ["codigoIndice"] });
    return empresas.map(empresa => empresa.codigoIndice);
  };

  public async actualizarCotizacionesMisIndices() {
    this.logger.log("CI - Actualizando cotizaciones de los indices en DB Local");
    const arrIndicesEnDBLocal = await this.buscarMisCodigosDeIndicesDeDB();
    this.logger.log(arrIndicesEnDBLocal);
    if (arrIndicesEnDBLocal && arrIndicesEnDBLocal.length > 0) {
      for (const codigoIndice of arrIndicesEnDBLocal) {
        try {
          await this.guardarTodasLasCotizaciones(codigoIndice);
        } catch (error) {
          this.logger.error(`Error al actualizar cotizaciones para la empresa ${codigoIndice}: ${error.message}`);
        }
      }
    } else {
      this.logger.error("No hay empresas en su DB Local o la búsqueda falló");
    }
  }


  public async guardarTodasLasCotizaciones(codigoIndice: string): Promise<void> {
    this.logger.log(`Actualizando cotizaciones para en indice ${codigoIndice}`);

    // Obtener la última fecha de cotización en la base de datos
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codigoIndice);
    this.logger.log(`Última fecha en mi DB: ${JSON.stringify(ultimaFechaEnMiDB)}`);
    const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);
    this.logger.log(`String última fecha en mi DB: ${stringUltimaFechaEnMiDB}`);

    // Obtener la última fecha registrada en Gempresa
    const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
    this.logger.log(`Última fecha en Gempresa: ${ultimaFechaGempresa}`);
    const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);
    this.logger.log(`String última fecha en Gempresa: ${stringUltimaFechaDeGempresa}`);

    try {
      const cotizaciones = await this.getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(
        codigoIndice,
        stringUltimaFechaEnMiDB,
        stringUltimaFechaDeGempresa,
      );

      this.logger.log(`Cotizaciones procesadas para ${codigoIndice}: ${cotizaciones.length}`);
    } catch (error) {
      this.logger.error(`Error al guardar cotizaciones para ${codigoIndice}: ${error.message}`);
    }
  }

  public async ultimaFechaDeCotizacionEnMiDB(codigoIndice: string): Promise<IFecha> {
    try {
      this.logger.log('Buscando última cotización para codEmpresa:', codigoIndice);
      const empresa = await this.indiceRepository.findOne({ where: { codigoIndice } });

      const ultimaCotizacion = await this.cotizacionIndiceRepository.createQueryBuilder('cotizacion')
        .leftJoinAndSelect('cotizacion.codigoIndice', 'indice')
        .where('indice.codigoIndice = :codigoIndice', { codigoIndice })
        .orderBy('cotizacion.id', 'DESC')
        .getOne();

      if (!ultimaCotizacion) { // Verificación si hay resultados
        return DateMomentsUtils.transformarFechaAGMT('2024-01-01', '00:00'); // Fecha por defecto si no hay resultados
      } else {
        return DateMomentsUtils.transformarFechaAGMT(ultimaCotizacion.fecha, ultimaCotizacion.hora);
      }

    } catch (error) {
      this.logger.debug("Error al buscar la última cotización:", error);
      throw error;
    }
  }

  public async ultimaFechaRegistradaEnGempresa(): Promise<IFecha> {
    return DateMomentsUtils.getUltimaFechaCotizacionGempresa();
  }

  public async getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codigoIndice: string, stringUltimaFechaEnMiDB: string, stringUltimaFechaDeGempresa: string): Promise<CotizacionIndice[]> {
    this.logger.log(`Actualizando cotizaciones de ${codigoIndice} desde ${stringUltimaFechaEnMiDB} hasta ${stringUltimaFechaDeGempresa}`);

    const indice = await this.indiceRepository.findOne({ where: { codigoIndice } });

    const respuesta: AxiosResponse<any, any> = await axios.get(`${baseURL}/indices/${codigoIndice}/cotizaciones?fechaDesde=${stringUltimaFechaEnMiDB}&fechaHasta=${stringUltimaFechaDeGempresa}`);


    this.logger.log(`Respuesta de Gempresa: ${JSON.stringify(respuesta.data)}`);

    const horarioDeBolsaUTC = DateMomentsUtils.getHorarioDeBolsaUTC();
    this.logger.log(`Horario de Bolsa en UTC: ${JSON.stringify(horarioDeBolsaUTC)}`);

    const cotizacionesFaltantes = await Promise.all(respuesta.data.map(async (cotizacion) => {
      const fechaUTC = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);

      this.logger.log(`Procesando cotización: Fecha UTC=${fechaUTC.fecha}, Hora UTC=${fechaUTC.hora}`);

      if (horarioDeBolsaUTC.includes(fechaUTC.hora)) {
        const nuevaCotizacionIndice = new CotizacionIndice(
          fechaUTC.fecha,
          fechaUTC.hora,
          cotizacion.valorCotizacionIndice,
          indice
        );

        this.logger.debug(`Guardando cotización: ${JSON.stringify(nuevaCotizacionIndice)}`);
        await this.guardarCotizacionEnDB(nuevaCotizacionIndice);
      } else {
        this.logger.warn(`Cotización fuera de horario: ${JSON.stringify(fechaUTC)}`);
      }
    }));

    await Promise.all(cotizacionesFaltantes);
    this.logger.log(`Procesamiento completado para ${codigoIndice}`);
    return respuesta.data;
  }

  public async guardarCotizacionEnDB(cotizacionIndice: CotizacionIndice): Promise<CotizacionIndice> {
    try {
      const hayCotizacion = await this.buscarCotizacionPorID(cotizacionIndice.id);
      if (!hayCotizacion) {
        return this.cotizacionIndiceRepository.save(cotizacionIndice);
      } else {
        this.logger.log("La cotización ya existe en la base de datos");
      }
    } catch (error) {
      this.logger.error("Error guardando la cotización:", error);
      throw error;
    }
  }
  public async buscarCotizacionPorID(cotizacionIndiceID: number): Promise<CotizacionIndice> {
    try {
      return this.cotizacionIndiceRepository.findOne({ where: { id: cotizacionIndiceID } });
    } catch (error) {
      this.logger.error("Error buscando cotización:", error);
      throw error;
    }
  }

}


