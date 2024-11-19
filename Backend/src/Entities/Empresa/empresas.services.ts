import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { Repository } from 'typeorm';
import clienteAxios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';

@Injectable()
export class EmpresasService {
  constructor(@InjectRepository(Empresa) private readonly empresaRepository: Repository<Empresa>) { }
  private readonly logger = new Logger(EmpresasService.name);

  //Retorna un arreglo con todos los codigos de las empresas de mi DB local
  //Postman: http://localhost:8080/empresas
  public async buscarMisEmpresasDeDB(): Promise<string[]> {
    this.logger.log("ES - Obteniendo codEmpresas[] de mi DB Local");
    const empresas = await this.empresaRepository.find({ select: ["codEmpresa"] });
    return empresas.map(empresa => empresa.codEmpresa);
  };

  //Trae el detalle de la empresa desde Gempresa segun el codEmpresa que se indica
  //NO VA A GUARDAR los datos en local
  //Postman: http://localhost:8080/empresas/XOM
  public async getDetalleSegunCodEmpresaDesdeGempresa(codEmpresa: string): Promise<Empresa> {
    try {
      const respuestaGempresa: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/empresas/${codEmpresa}/details`);
      this.logger.log(`ES - Detalle: ${respuestaGempresa.data.codempresa}`);
      return respuestaGempresa.data;
    } catch (error) {
      this.logger.error("ES - El codigo de empresa indicado no existe. Intente con otro.");
    };
  };

  //Segun el codigo de empresa recibido reviso mi DB local para ver si la empresa ya fue cargada.
  //Si no esta cargada, la busco en Gempresa por Codigo Empresa y luego la guardo en DB local.
  //Si la empresa ya esta cargada informo: "La empresa ya existe en la DB"
  //Postman: http://localhost:8080/empresas/guardar/TM
  public async guardarEmpresaEnDBLocal(codEmpresa: string): Promise<Empresa> {
    try {
      if (await this.buscarEmpresaEnDBLocal(codEmpresa) == null) {
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
        this.logger.log("EmpresaService - La empresa ya existe en la DB - 1111");
      }
    } catch (error) {
      this.logger.error("EmpresaService - Error al guardar la empresa, no existe el codigo indicado");
      throw error
    }
  };

  //Solo busca el codigo de empresa indicado en mi base de datos local
  //Postman: http://localhost:8080/empresas/buscarEmpresaEnDBLocal/V
  public async buscarEmpresaEnDBLocal(codEmp: string): Promise<Empresa | string | null> {
    try {
      const empresadeDBLocal: Empresa = await this.empresaRepository.findOne({where: { codEmpresa: codEmp },});
      if (empresadeDBLocal) {
        this.logger.log("ES - Empresa encontrada en DB Local");
        return empresadeDBLocal;
      } else {
        this.logger.log("ES  - La empresa no existe en la DB Local") ;
      }
    } catch (error) {
      this.logger.error("ES - Error:", error.message);
      throw error;
    }
  }
}
