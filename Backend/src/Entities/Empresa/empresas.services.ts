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
    idEmpresa: 1,
    nombreEmpresa: "Amazon.com Inc.",
    abreviacion: "AMZN",
    paisEmpresa: "USA",
    bolsaEnQueCotiza: "NASDAQ",
  }, {
    idEmpresa: 2,
    nombreEmpresa: "ExxonMobil Corporation",
    abreviacion: "XOM",
    paisEmpresa: "USA",
    bolsaEnQueCotiza: "NYSE", 
  }, {
    idEmpresa: 3,
    nombreEmpresa: "UnitedHeath Group Incorporated",
    abreviacion: "UNH",
    paisEmpresa: "USA",
    bolsaEnQueCotiza: "NYSE", 
  }
  , {
    idEmpresa: 4,
    nombreEmpresa: "PepsiCo, Inc.",
    abreviacion: "PEP",
    paisEmpresa: "USA",
    bolsaEnQueCotiza: "NASDAQ", 
  }
  , {
    idEmpresa: 5,
    nombreEmpresa: "TotalEnergies SE",
    abreviacion: "TTE",
    paisEmpresa: "USA",
    bolsaEnQueCotiza: "EPA", 
  }, {
    idEmpresa: 6,
    nombreEmpresa: "Alibaba Group",
    abreviacion: "BABA",
    paisEmpresa: "China - Hong Kong",
    bolsaEnQueCotiza: "HKG", 
  }
  , {
    idEmpresa: 7,
    nombreEmpresa: "Novartis AG",
    abreviacion: "NOVN.SW",
    paisEmpresa: "Suiza",
    bolsaEnQueCotiza: "SWX", 
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