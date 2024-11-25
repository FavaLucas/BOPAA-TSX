import { Injectable, Logger } from '@nestjs/common';
import { CotizacionIndice } from './cotizacionIndice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Indice } from '../Indice/indice.entity';
import DateMomentsUtils from 'src/utils/DateMomentsUtils';
import { IFecha } from 'src/Models/fecha.model';
import axios from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';
import { Cotizacion } from '../Cotizacion/cotizacion.entity';
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


  public async buscarMisCodigosDeIndicesDeDB(): Promise<string[]> {
    const empresas = await this.indiceRepository.find({ select: ["codigoIndice"] });
    return empresas.map(empresa => empresa.codigoIndice);
  }
  public async actualizarCotizacionesMisIndices() {
    this.logger.log("CIS - Actualizando cotizaciones de los índices en la DB local");
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

    const fechaDesde = new Date(stringUltimaFechaEnMiDB);
    const fechaHasta = new Date(stringUltimaFechaDeGempresa);

    const cotizacionesFaltantes = [];
    const solicitudes = [];

    for (let fecha = new Date(fechaDesde); fecha <= fechaHasta; fecha.setDate(fecha.getDate() + 1)) {
      const fechaInicio = DateMomentsUtils.formatearFecha({ fecha: fecha.toISOString().split('T')[0], hora: '00:00' });
      const fechaFin = DateMomentsUtils.formatearFecha({ fecha: fecha.toISOString().split('T')[0], hora: '23:59' });

      const url = `${baseURL}/indices/${codigoIndice}/cotizaciones?fechaDesde=${encodeURIComponent(fechaInicio)}&fechaHasta=${encodeURIComponent(fechaFin)}`;

      solicitudes.push(axios.get(url)
        .then(respuesta => {
          cotizacionesFaltantes.push(...respuesta.data);
        })
        .catch(error => {
          this.logger.error(`CIS - Error obteniendo cotizaciones de ${codigoIndice} en la fecha ${fechaInicio}: ${error.message}`);
        })
      );
    }

    await Promise.all(solicitudes);

    const horarioDeBolsaUTC = [
      "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00"
    ];

    await Promise.all(cotizacionesFaltantes.map(async (cotizacion) => {
      const fechaUTC = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);

      if (horarioDeBolsaUTC.includes(fechaUTC.hora)) {
        const nuevaCotizacionIndice = new CotizacionIndice(
          fechaUTC.fecha,
          fechaUTC.hora,
          cotizacion.valor,
          indice
        );

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
          codigoIndice: { codigoIndice: cotizacionIndice.codigoIndice.codigoIndice }
        }
      });
      if (!hayCotizacion) {
        return this.cotizacionIndiceRepository.save(cotizacionIndice);
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
          codigoIndice: { codigoIndice: cotizacionIndice.codigoIndice.codigoIndice }
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
  async calcularIndice(): Promise<number> {
    const cotizaciones = await this.cotizacionesService.obtenerTodasLasCotizaciones();
    this.logger.log(`Número de cotizaciones obtenidas: ${cotizaciones.length}`);

    const cotizacionesPorDiaYHora = {};

    cotizaciones.forEach(cotizacion => {
      const valorCotizacion = Number(cotizacion.cotizacion); // Asegúrate de que sea un número
      if (isNaN(valorCotizacion)) {
        this.logger.error(`Cotización no válida: ${JSON.stringify(cotizacion)}`);
        return; // Ignorar cotizaciones no válidas
      }

      const fechaHora = `${cotizacion.fecha} ${cotizacion.hora}`;
      if (!cotizacionesPorDiaYHora[fechaHora]) {
        cotizacionesPorDiaYHora[fechaHora] = [];
      }
      cotizacionesPorDiaYHora[fechaHora].push(valorCotizacion);
    });

    let sumaTotal = 0;
    let cantidadTotal = 0;

    Object.keys(cotizacionesPorDiaYHora).forEach(fechaHora => {
      const sumaCotizaciones = cotizacionesPorDiaYHora[fechaHora].reduce((acc, curr) => acc + curr, 0);
      const cantidadCotizaciones = cotizacionesPorDiaYHora[fechaHora].length;

      if (cantidadCotizaciones > 0) {
        const promedioCotizaciones = sumaCotizaciones / cantidadCotizaciones;

        sumaTotal += promedioCotizaciones;
        cantidadTotal += 1;
      }
    });

    return cantidadTotal > 0 ? sumaTotal / cantidadTotal : 0; 
  }


  async guardarIndiceEnDB(indice: number, fecha: string, hora: string): Promise<void> {
    const miIndice = await this.indiceRepository.findOne({ where: { codigoIndice: 'TSX' } });

    const nuevoIndice = new CotizacionIndice(fecha, hora, indice, miIndice);

    await this.cotizacionIndiceRepository.save(nuevoIndice);
  }
  async publicarIndiceEnGempresa(indice: number, fecha: string, hora: string): Promise<void> {
    const data = { valor: indice, fecha, hora };
    const url = "http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones"
    try {
      await axios.post(url, data);
      this.logger.log('Índice publicado en Gempresa');
    } catch (error) {
      this.logger.error(`Error al publicar el índice en Gempresa: ${error.message}`);
    }
  }
  async calcularYPublicarIndice(): Promise<void> {
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toISOString().split('T')[1].split('.')[0];

    const indice = await this.calcularIndice();
    if (isNaN(indice)) {
      throw new Error('El índice calculado es NaN');
    }
    await this.guardarIndiceEnDB(indice, fecha, hora);
    await this.publicarIndiceEnGempresa(indice, fecha, hora);
  }
}


