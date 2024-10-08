import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Empresa } from './empresa.entity';

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

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>) { }

  public async getAllEmpresas(): Promise<Empresa[]> {
    console.log("Get AllEmpresas");
    const options: FindManyOptions = { relations: ['cotizaciones'] };
    const empresas: Empresa[] = await this.empresaRepository.find(options);
    return empresas;
  }

}