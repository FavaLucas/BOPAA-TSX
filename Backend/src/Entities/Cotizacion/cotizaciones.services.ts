import { Injectable, } from '@nestjs/common';
import { Cotizacion } from './cotizacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import clienteAxios from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';

@Injectable()
export class CotizacionesService {

  constructor(@InjectRepository(Cotizacion) private readonly cotizacionRepository: Repository<Cotizacion>) { }

  public async getCotizaciones() {
      return this.cotizacionRepository.find();
  }


  public async getCotizacionesByEmpresaEntreFechas(codEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]> {
    console.log("Get AllCotizaciones");
    console.log(`${baseURL}/cotizaciones/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);

    const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);

    console.log(respuestaGempresa.data)
    respuestaGempresa.data.forEach(cotizacion1 => {
      const nuevaCotizacion = new Cotizacion(
        cotizacion1.fecha,
        cotizacion1.hora,
        cotizacion1.dateUTC,
        cotizacion1.cotization,
        cotizacion1.codEmp = codEmpresa,
      );
      this.cotizacionRepository.save(nuevaCotizacion);
    });

    return respuestaGempresa.data;
  }

  public async getCotizacionesFechaYHora(codEmpresa: string, fecha: string, hora: string): Promise<Cotizacion[]> {
    console.log("Get otracosa");
    console.log(`${baseURL}/cotizaciones/${codEmpresa}/cotizaciones?fecha=${fecha}&hora=${hora}`);
    const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/cotizacion?fecha=${fecha}&hora=${hora}`);

    const nuevaCotizacion = new Cotizacion(
      respuestaGempresa.data.fecha,
      respuestaGempresa.data.hora,
      respuestaGempresa.data.dateUTC,
      respuestaGempresa.data.cotization,
      respuestaGempresa.data.codEmp = codEmpresa
    );

    await this.cotizacionRepository.save(nuevaCotizacion);



    return respuestaGempresa.data;
  }

}

// http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/cotizaciones/BABA/cotizaciones?fechaDesde=undefined&fechaHasta=undefined
// http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/cotizaciones/BABA/cotizaciones?fechaDesde=undefined&fechaHasta=undefined