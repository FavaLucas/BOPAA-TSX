import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';
import clienteAxios from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';


@Injectable()
export class EmpresasService {

  constructor(@InjectRepository(Empresa) private readonly empresaRepository: Repository<Empresa>) { }

  public async getEmpresa(codEmpresa: string): Promise<Empresa> {
    console.log("Get AllEmpresas");
    const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/details`)

    const nuevaEmpresa = new Empresa(
      respuestaGempresa.data.codempresa,
      respuestaGempresa.data.empresaNombre,
      respuestaGempresa.data.cotizationInicial,
      respuestaGempresa.data.cantidadAcciones
    );

    await this.empresaRepository.save(nuevaEmpresa);

    return respuestaGempresa.data;
  }

}