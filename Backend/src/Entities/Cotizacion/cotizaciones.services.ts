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
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codEmpresa);
    this.logger.log(`Ultima fecha en mi DB: ${JSON.stringify(ultimaFechaEnMiDB)}`);
    const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);
    this.logger.log(`String ultima fecha en mi DB: ${JSON.stringify(stringUltimaFechaEnMiDB)}`);

    const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
    this.logger.log("Ultima fecha en Gempresa:", ultimaFechaGempresa);
    const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);

    this.logger.log(`Gempresa fecha string: ${stringUltimaFechaDeGempresa}`);

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
  
      // Verificar si la hora está dentro del horario de apertura de la bolsa en UTC
      if (horarioDeBolsaUTC.includes(fechaUTC.hora)) {
        const nuevaCotizacion = new Cotizacion(
          cotizacion.id,
          fechaUTC.fecha,
          fechaUTC.hora,
          cotizacion.cotization,
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
  
}




/* function generarHoraGMTdesdeDate(stringUltimaFechaDeGempresa: string) {
  throw new Error('Function not implemented.');
} */


/*   public async traerTodasLasCotizaciones(): Promise<Cotizacion[]> {
    const codEmpresa = "XOM";
    const fechaDesdeUTC = "2024-11-16";
    const horaDesdeUTC = "00:00";
    const fechaHastaUTC = "2024-11-16";
    const horaHastaUTC = "21:00";
  
    const url = `${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesdeUTC}T${horaDesdeUTC}&fechaHasta=${fechaHastaUTC}T${horaHastaUTC}`;
  
    try {
      const response = await clienteAxios.get(url);
      const todasLasCotizaciones: Cotizacion[] = response.data;
  
      // Filtrar las cotizaciones que están dentro del horario de bolsa
      const cotizacionesEnHorario = todasLasCotizaciones.filter((cotizacion) => 
        DateMomentsUtils.horarioDeBolsa.includes(cotizacion.hora)
      );
  
      this.logger.debug("Cotizaciones filtradas en horario de bolsa:", cotizacionesEnHorario);
  
      // Guardar las cotizaciones en la base de datos
      for (const cotizacion of cotizacionesEnHorario) {
        try {
          await this.cotizacionRepository.save(cotizacion);
          this.logger.debug(`Cotización guardada: ${JSON.stringify(cotizacion)}`);
        } catch (error) {
          this.logger.error("Error al guardar la cotización:", error.message);
        }
      }
  
      return cotizacionesEnHorario;
    } catch (error) {
      this.logger.error("Error buscando cotización:", error.message);
      throw new Error("Error buscando cotización");
    }
  } */



/*   public async guardarAOE2(codEmpresa: string): Promise<void> {
    try {
      // Obtener la última fecha en mi DB
      const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codEmpresa);
      if (!ultimaFechaEnMiDB) {
        this.logger.warn(`No se encontró una última fecha para la empresa ${codEmpresa}.`);
        return;
      }
  
      const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);
  
      // Obtener la última fecha registrada en Gempresa
      const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
      if (!ultimaFechaGempresa) {
        this.logger.warn(`No se pudo obtener la última fecha registrada en Gempresa para la empresa ${codEmpresa}.`);
        return;
      }
  
      const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);
  
      // Log de información
      this.logger.log(`Actualizando cotizaciones de ${codEmpresa} desde ${stringUltimaFechaEnMiDB} hasta ${stringUltimaFechaDeGempresa}.`);
  
      // Verificar si hay un rango válido para actualizar
      if (stringUltimaFechaEnMiDB >= stringUltimaFechaDeGempresa) {
        this.logger.warn(`No hay cotizaciones nuevas para ${codEmpresa}.`);
        return;
      }
  
      // Obtener las cotizaciones desde Gempresa
      const cotizaciones = await this.AOE(
        codEmpresa,
        stringUltimaFechaEnMiDB,
        stringUltimaFechaDeGempresa
      );
  
      // Guardar las cotizaciones en la base de datos
      for (const cotizacion of cotizaciones) {
        try {
          await this.guardarCotizacionEnDB(cotizacion);
        } catch (error) {
          this.logger.error(`Error guardando cotización con ID ${cotizacion.id}: ${error.message}`);
        }
      }
  
      this.logger.log(`Cotizaciones guardadas exitosamente para la empresa ${codEmpresa}.`);
    } catch (error) {
      this.logger.error(`Error al guardar todas las cotizaciones para ${codEmpresa}: ${error.message}`);
      throw error;
    }
  } */


/*   public async AOE(
    codEmpresa: string,
    stringUltimaFechaEnMiDB: string,
    stringUltimaFechaDeGempresa: string
  ): Promise<Cotizacion[]> {
    this.logger.log(`Actualizando cotizaciones de ${codEmpresa} desde ${stringUltimaFechaEnMiDB} hasta ${stringUltimaFechaDeGempresa}`);
  
    const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });
  
    if (!empresa) {
      this.logger.error(`La empresa con codEmpresa ${codEmpresa} no existe en la base de datos local.`);
      return [];
    }
  
    try {
      // Hacemos la solicitud para obtener las cotizaciones entre las fechas especificadas
      const respuesta: AxiosResponse<any, any> = await clienteAxios.get(
        `${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${stringUltimaFechaEnMiDB}&fechaHasta=${stringUltimaFechaDeGempresa}`
      );
  
      if (!respuesta.data || respuesta.data.length === 0) {
        this.logger.log(`No se encontraron cotizaciones en Gempresa para el periodo solicitado.`);
        return [];
      }
  
      // Procesamos las cotizaciones que recibimos
      const cotizacionesFaltantes = respuesta.data.map(async (cotizacion) => {
        // Convertimos la fecha y hora de Gempresa a formato GMT
        const fechaGMT = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);
  
        this.logger.debug(
          `Procesando cotización: Fecha GMT=${fechaGMT.fecha}, Hora GMT=${fechaGMT.hora}, Hora Bolsa Permitida=${DateMomentsUtils.horarioDeBolsa.includes(fechaGMT.hora)}`
        );
  
        // Verificamos si la hora de la cotización está dentro del horario de la bolsa
        if (DateMomentsUtils.horarioDeBolsa.includes(fechaGMT.hora)) {
          const nuevaCotizacion = new Cotizacion(
            cotizacion.id,
            fechaGMT.fecha,
            fechaGMT.hora,
            cotizacion.cotization,
            empresa
          );
  
          // Guardamos la cotización en la base de datos local
          try {
            await this.guardarCotizacionEnDB(nuevaCotizacion);
            this.logger.debug(`Cotización guardada: ${JSON.stringify(nuevaCotizacion)}`);
          } catch (error) {
            this.logger.error(`Error al guardar cotización: ${error.message}`);
          }
        } else {
          this.logger.warn(`Cotización fuera de horario: ${JSON.stringify(fechaGMT)}`);
        }
      });
  
      // Esperamos a que todas las cotizaciones sean procesadas
      await Promise.all(cotizacionesFaltantes);
  
      this.logger.log(`Procesamiento completado para ${codEmpresa}`);
      return respuesta.data;
  
    } catch (error) {
      this.logger.error(`Error al obtener las cotizaciones de Gempresa para ${codEmpresa}: ${error.message}`);
      throw new Error(`No se pudieron obtener las cotizaciones para la empresa ${codEmpresa}`);
    }
  } */





