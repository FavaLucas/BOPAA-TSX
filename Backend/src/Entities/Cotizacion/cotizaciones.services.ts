import { Injectable, Logger } from '@nestjs/common';
import { Cotizacion } from './cotizacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';
import DateMomentsUtils from 'src/utils/DateMomentsUtils';
import { IFecha } from 'src/Models/fecha.model';
import { Empresa } from '../Empresa/empresa.entity';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion) private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(Empresa) private readonly empresaRepository: Repository<Empresa>,
  ) { }

  private readonly logger = new Logger(CotizacionesService.name);

  // Obtener todas las cotizaciones guardadas en la base de datos local
  public async getCotizaciones(): Promise<Cotizacion[]> {
    this.logger.log("CS - Obteniendo todas las cotizaciones");
    return this.cotizacionRepository.find();
  }

  public async traerDatosDBLocalCotizacion(): Promise<Cotizacion[]>{
    return this.cotizacionRepository.find()
  }


  // Obtener cotizaciones de una empresa entre fechas específicas
  public async getCotizacionesEntreFechas(codEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]> {
    this.logger.log(`CS - Obteniendo cotizaciones desde Gempresa de la empresa ${codEmpresa} entre ${fechaDesde} y ${fechaHasta}`);

    const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });
    const fechaDesdeUTC = DateMomentsUtils.transformarFechaAGMT(fechaDesde.split("T")[0], fechaDesde.split("T")[1]);
    const fechaHastaUTC = DateMomentsUtils.transformarFechaAGMT(fechaHasta.split("T")[0], fechaHasta.split("T")[1]);

    if (!empresa) {
      this.logger.error("CS - La empresa ingresada no existe en la base de datos local.");
      return [];
    }

    const respuestaGempresa = await axios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesdeUTC.fecha}T${fechaDesdeUTC.hora}&fechaHasta=${fechaHastaUTC.fecha}T${fechaHastaUTC.hora}`);
    const cotizaciones = respuestaGempresa.data.map(cotizacion => {
      const fechaLocal = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);
      return new Cotizacion(cotizacion.id, fechaLocal.fecha, fechaLocal.hora, cotizacion.cotization, empresa);
    });

    await this.cotizacionRepository.save(cotizaciones);
    return cotizaciones;
  }

  // Obtener cotización específica de una empresa por fecha y hora
  public async getCotizacionesFechaYHora(codEmpresa: string, fecha: string, hora: string): Promise<Cotizacion[]> {
    this.logger.log(`CC - Obteniendo cotización de la empresa ${codEmpresa} el día ${fecha} a la hora ${hora}`);

    try {
      const cotizacion = await this.cotizacionRepository.findOne({
        relations: ['codEmpresaFK'],
        where: {
          codEmpresaFK: { codEmpresa },
          fecha,
          hora
        }
      });

      if (cotizacion) {
        this.logger.log("CS - Cotización encontrada.");
        return [cotizacion];
      } else {
        this.logger.warn("CS - No se encontró ninguna cotización para la fecha y hora especificadas.");
        return [];
      }
    } catch (error) {
      this.logger.error(`Error al obtener la cotización de la empresa ${codEmpresa}: ${error.message}`);
      throw new Error(`No se pudo obtener la cotización para la empresa ${codEmpresa}`);
    }
  }

  // Actualizar todas las cotizaciones de una empresa
  public async guardarTodasLasCotizaciones(codEmpresa: string): Promise<void> {
    this.logger.log(`Actualizando cotizaciones para ${codEmpresa}`);

    // Obtener la última fecha de cotización en la base de datos
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codEmpresa);
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
        codEmpresa,
        stringUltimaFechaEnMiDB,
        stringUltimaFechaDeGempresa,
      );

      this.logger.log(`Cotizaciones procesadas para ${codEmpresa}: ${cotizaciones.length}`);
    } catch (error) {
      this.logger.error(`Error al guardar cotizaciones para ${codEmpresa}: ${error.message}`);
    }
  }


  // Obtener la última fecha de cotización registrada en la base de datos local
  public async ultimaFechaDeCotizacionEnMiDB(codEmpresa: string): Promise<IFecha> {
    try {
      this.logger.log('Buscando última cotización para codEmpresa:', codEmpresa);
      const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });

      const ultimaCotizacion = await this.cotizacionRepository.find({
        relations: ['codEmpresaFK'],
        where: { codEmpresaFK: { codEmpresa } },
        order: { id: 'DESC' },
        take: 1,
      });

      const fechaCotizacion = ultimaCotizacion[0];
      if (!fechaCotizacion || !fechaCotizacion.fecha) {
        return DateMomentsUtils.transformarFechaAGMT('2024-01-01', '00:00');
      } else {
        return DateMomentsUtils.transformarFechaAGMT(fechaCotizacion.fecha, fechaCotizacion.hora);
      }
    } catch (error) {
      this.logger.error("Error al buscar la última cotización:", error);
      throw error;
    }
  }

  // Obtener la última fecha de cotización registrada en Gempresa
  public async ultimaFechaRegistradaEnGempresa(): Promise<IFecha> {
    return DateMomentsUtils.getUltimaFechaCotizacionGempresa();
  }

  // Guardar una cotización en la base de datos
  public async guardarCotizacionEnDB(cotizacion: Cotizacion): Promise<Cotizacion> {
    try {
      const hayCotizacion = await this.buscarCotizacionPorID(cotizacion.id);
      if (!hayCotizacion) {
        return this.cotizacionRepository.save(cotizacion);
      } else {
        this.logger.log("La cotización ya existe en la base de datos");
      }
    } catch (error) {
      this.logger.error("Error guardando la cotización:", error);
      throw error;
    }
  }

  // Buscar cotización por ID
  public async buscarCotizacionPorID(cotizacionID: number): Promise<Cotizacion> {
    try {
      return this.cotizacionRepository.findOne({ where: { id: cotizacionID } });
    } catch (error) {
      this.logger.error("Error buscando cotización:", error);
      throw error;
    }
  }

  // Obtener cotizaciones de Gempresa con codEmpresa y fechas en GMT
  public async getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codEmpresa: string, stringUltimaFechaEnMiDB: string, stringUltimaFechaDeGempresa: string): Promise<Cotizacion[]> {
    this.logger.log(`Actualizando cotizaciones de ${codEmpresa} desde ${stringUltimaFechaEnMiDB} hasta ${stringUltimaFechaDeGempresa}`);

    const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });

    const respuesta: AxiosResponse<any, any> = await axios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${stringUltimaFechaEnMiDB}&fechaHasta=${stringUltimaFechaDeGempresa}`);
    this.logger.log(`Respuesta de Gempresa: ${JSON.stringify(respuesta.data)}`);

    const horarioDeBolsaUTC = DateMomentsUtils.getHorarioDeBolsaUTC();
    this.logger.debug(`Horario de Bolsa en UTC: ${JSON.stringify(horarioDeBolsaUTC)}`);

    const cotizacionesFaltantes = await Promise.all(respuesta.data.map(async (cotizacion) => {
      const fechaUTC = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);

      this.logger.debug(`Procesando cotización: Fecha UTC=${fechaUTC.fecha}, Hora UTC=${fechaUTC.hora}`);

      const valorCotizacion = Number(cotizacion.cotization);
      if (isNaN(valorCotizacion)) {
        this.logger.error(`Valor de cotización no válido: ${cotizacion.cotization}`);
        return;
      }

      if (horarioDeBolsaUTC.includes(fechaUTC.hora)) {
        const nuevaCotizacion = new Cotizacion(
          cotizacion.id,
          fechaUTC.fecha,
          fechaUTC.hora,
          valorCotizacion,
          empresa
        );

        this.logger.debug(`Guardando cotización: ${JSON.stringify(nuevaCotizacion)}`);
        await this.guardarCotizacionEnDB(nuevaCotizacion);
      } else {
        this.logger.warn(`Cotización fuera de horario: ${JSON.stringify(fechaUTC)}`);
      }
    }));

    await Promise.all(cotizacionesFaltantes);
    this.logger.log(`Procesamiento completado para ${codEmpresa}`);
    return respuesta.data;
  }

  public async obtenerTodasLasCotizaciones(): Promise<Cotizacion[]> {
    try {
      return this.cotizacionRepository.find();
    }
    catch (error) {
      this.logger.error("Error obteniendo todas las cotizaciones:", error);
      throw error;
    }
  }



  public async getFiltrarCotizaciones(codEmpresa: string): Promise<Cotizacion[]> {
    try {
      const cotizacionesEmpresa = await this.cotizacionRepository.find({
        relations: ['codEmpresaFK'], // Relación a incluir
        where: {
          codEmpresaFK: {
            codEmpresa: codEmpresa, // Aquí 'id' se debe reemplazar por el nombre de la columna de `Empresa` que corresponde a `codEmpresa`
          },
        }
      });
      console.log("console log service", cotizacionesEmpresa)
      return Promise.all(cotizacionesEmpresa)
    } catch (error) {
      console.error("Error al filtrar cotizaciones por codEmpresa: ", error);
      throw new Error("No se pudo obtener las cotizaciones");
    }
  }




}