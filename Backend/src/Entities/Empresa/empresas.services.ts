import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { IEmpresa } from './IEmpresa';

//import { DatabaseService } from './db.service';
//import turnosQueries from './queries/turnos.queries';
//import { ResultSetHeader, RowDataPacket } from "mysql2";

// let empresas: Empresa[] = [
//   {
//     id: 1,
//     nombre: 'ExxonMobil Corpotation',
//     abreviacion: "XOM",
//     pais: "Estados Unidos",
//     bolsaDeCotizacion: "Estados Unidos"
//   }]

@Injectable()
export class EmpresasService {

  private empresas: Empresa[] = [];
  public empresasMock: IEmpresa[] = [{
    id: 1,
    empresaNombre: "Amazon.com Inc.",
    codEmpresa: "AMZN",
    cotizationInicial: 123,
    cantidadAcciones: 7,
  }, {
    id: 2,
    empresaNombre: "ExxonMobil Corporation",
    codEmpresa: "XOM",
    cotizationInicial: 234,
    cantidadAcciones: 6, 
  }, {
    id: 3,
    empresaNombre: "UnitedHeath Group Incorporated",
    codEmpresa: "UNH",
    cotizationInicial: 345,
    cantidadAcciones: 5, 
  }
  , {
    id: 4,
    empresaNombre: "PepsiCo, Inc.",
    codEmpresa: "PEP",
    cotizationInicial: 456,
    cantidadAcciones: 4, 
  }
  , {
    id: 5,
    empresaNombre: "TotalEnergies SE",
    codEmpresa: "TTE",
    cotizationInicial: 567,
    cantidadAcciones: 3, 
  }, {
    id: 6,
    empresaNombre: "Alibaba Group",
    codEmpresa: "BABA",
    cotizationInicial: 678,
    cantidadAcciones: 2, 
  }
  , {
    id: 7,
    empresaNombre: "Novartis AG",
    codEmpresa: "NOVN.SW",
    cotizationInicial: 789,
    cantidadAcciones: 1, 
  }]


  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>) { }

  public async getAllEmpresas(): Promise<Empresa[]> {
    console.log("Get AllEmpresas");
    const options: FindManyOptions = { relations: ['cotizaciones'] };
    const empresas: Empresa[] = await this.empresaRepository.find(options);
    return empresas;
  }

  public async getEmpresasMock(): Promise<IEmpresa[]> {
    console.log("Service Empresas-Mock");
    return this.empresasMock;
  }

}