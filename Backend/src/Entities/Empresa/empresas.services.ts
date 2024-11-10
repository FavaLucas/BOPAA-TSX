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
  public async buscarMisCodEmpresas() {
    const empresas = await this.empresaRepository.find();
    const codEmpresas = [];

    empresas.forEach(element => {
      codEmpresas.push(element.codEmpresa); 
    });
    return codEmpresas;
  }

  public async getEmpresa(codEmpresa: string): Promise<Empresa> {
    try {
      const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/details`);
      return respuestaGempresa.data;
    } catch (error) {
      console.error("Error al buscar la empresa");
    }
  }

  public async guardarEmpresa(codEmpresa: string): Promise<Empresa> {
    try {
      if (await this.buscarEmpresa(codEmpresa) == null) {
        const respuesta: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/details`);
        const nuevaEmpresa = new Empresa(
          respuesta.data.codempresa,
          respuesta.data.empresaNombre,
          respuesta.data.cotizationInicial,
          respuesta.data.cantidadAcciones
        );
        const guardarEmpresa = await this.empresaRepository.save(nuevaEmpresa);
        return guardarEmpresa;
      }
      else {
        console.log("La empresa ya existe en la DB");
      }
    } catch (error) {
      console.error("Error al guardar la empresa", error);
      throw error
    }
  };

  public async buscarEmpresa(codEmp: string): Promise<Empresa> {
    try {
      const empresas: Empresa = await this.empresaRepository.findOne({
        where: { codEmpresa: codEmp },
      });
      return empresas;
    } catch (error) {
      console.error("Error al buscar la empresa con codEmp", error);
      throw error;
    }
  }
}