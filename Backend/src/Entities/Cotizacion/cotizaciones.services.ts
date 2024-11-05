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

  public async getCotizacionesByEmpresa(codEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]> {

    console.log("Get AllCotizaciones");
    console.log(`${baseURL}/cotizaciones/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);

    const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
    

    return respuestaGempresa.data;
  }
}



