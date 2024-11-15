import { Injectable, Logger } from '@nestjs/common';
import { Cotizacion } from './cotizacion.entity';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import clienteAxios, { AxiosResponse } from 'axios';
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

  //Trae todas las cotizaciones guardadas en mi DB Local
  //Postman: http://localhost:8080/cotizaciones/
  public async getCotizaciones() {
    this.logger.log("CS - Obteniendo todas las cotizaciones");
    return this.cotizacionRepository.find();
  }

  //Ingreso con fechaDesde y hasta de tipo: 2024-11-14T00:00
  //http://localhost:8080/cotizaciones/entreFechas/V?fechaDesde=2024-11-01T00:00&fechaHasta=2021-11-14T20:00
  public async getCotizacionesEntreFechas(codEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]> {
    this.logger.log(`CC - Obteniendo cotizaciones desde Gempresa de la empresa ${codEmpresa} entre ${fechaDesde} y ${fechaHasta}`);

    const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);

    this.logger.log(respuestaGempresa.data)
    respuestaGempresa.data.forEach(cotizacion => {
      const nuevaCotizacion = new Cotizacion(
        cotizacion.id,
        cotizacion.fecha,
        cotizacion.hora,
        cotizacion.cotization,
        cotizacion.codEmpresaFK
      );
      this.cotizacionRepository.save(nuevaCotizacion);
    });

    return respuestaGempresa.data;
  }
























  public async getCotizacionesFechaYHora(codEmpresa: string, fecha: string, hora: string): Promise<Cotizacion[]> {
    this.logger.log(`${baseURL}/cotizaciones/${codEmpresa}/cotizaciones?fecha=${fecha}&hora=${hora}`);
    const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/cotizacion?fecha=${fecha}&hora=${hora}`);

    const nuevaCotizacion = new Cotizacion(
      respuestaGempresa.data.id,
      respuestaGempresa.data.fecha,
      respuestaGempresa.data.hora,
      respuestaGempresa.data.cotization,
      respuestaGempresa.data.codEmpresaFK
    );

    await this.cotizacionRepository.save(nuevaCotizacion);

    return respuestaGempresa.data;
  }



  ////////////////////////////////////////////////////////////

  public async ultimaFechaRegistradaEnGempresa(): Promise<IFecha> {
    const fecha = DateMomentsUtils.getUltimaFechaCotizacionGempresa();
    return fecha;
  }

  public async ultimaFechaDeCotizacionEnMiDB(codEmpresa: string): Promise<IFecha> {
    try {
      this.logger.log('codEmp:', codEmpresa);
      const empresa = await this.empresaRepository.findOne({
        where: { codEmpresa: codEmpresa }
      });
      if (!empresa) {
        console.log(`No se encontró una empresa con codEmpresa: ${codEmpresa}`);
        return null;
      }

      const ultimaCotizacion: Cotizacion[] = await this.cotizacionRepository.find({
        where: { codEmpresaFK: Equal(empresa.codEmpresa) },
        order: { id: 'DESC' },
        take: 1
      })
      const fechaCotizacion = ultimaCotizacion[0];

      if (!fechaCotizacion || !fechaCotizacion.fecha) {
        const fecha: IFecha = DateMomentsUtils.transformarFechaAGMT('2024-01-01', '00:00')
        return fecha;
      } else {
        const fecha: IFecha = DateMomentsUtils.transformarFechaAGMT(fechaCotizacion.fecha, fechaCotizacion.hora)
        return fecha;
      }
    } catch (error) {
      this.logger.error("Error al buscar la ultima cotizacion: ", error);
      return null;
    };
  };

  public async buscarCotizacionPorID(cotizacionID: number): Promise<Cotizacion> {
    try {
      const cotizaciones: Cotizacion = await this.cotizacionRepository.findOne({
        where: { id: cotizacionID }
      });
      return cotizaciones;
    } catch (error) {
      this.logger.error("Error buscando cotizacion", error);
      throw error;
    };
  }


  public async guardarCotizacionEnDB(cotizacion: Cotizacion) {
    try {
      const hayCotizacion = await this.buscarCotizacionPorID(cotizacion.id)
      if (hayCotizacion == null) {
        const guardarCotizacion = await this.cotizacionRepository.save(cotizacion);
        return guardarCotizacion;
      } else {
        this.logger.log("Ya existe esta cotizacion en la DB");
      }
    } catch (error) {
      this.logger.error("Error guardando la cotizacion", error);
      throw error;
    }
  }


  public async getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codEmpresa: string, stringUltimaFechaEnMiDB: string, stringUltimaFechaDeGempresa: string): Promise<Cotizacion[]> {
    const empresa = await this.empresaRepository.findOne({
      where: { codEmpresa }
    });
    const respuesta: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}
      /cotizaciones?fechaDesde=${stringUltimaFechaEnMiDB}&fechaHasta=${stringUltimaFechaDeGempresa}`);

    respuesta.data.forEach(cotizacion => {
      const fechaGMT = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);
      if (DateMomentsUtils.horarioDeBolsa.includes(fechaGMT.hora)) {
        const nuevaCotizacion = new Cotizacion(
          cotizacion.id,
          cotizacion.fecha,
          cotizacion.hora,
          cotizacion.cotization,
          empresa
        )
        this.guardarCotizacionEnDB(nuevaCotizacion);
      };
    });
    return respuesta.data;
  }

  public async guardarTodasLasCotizaciones(codEmpresa: string) {
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codEmpresa);
    const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);
    const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
    const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);

    this.getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codEmpresa, stringUltimaFechaEnMiDB, stringUltimaFechaDeGempresa)
  }
}

