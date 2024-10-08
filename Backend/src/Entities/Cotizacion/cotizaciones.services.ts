import { Injectable, } from '@nestjs/common';
import { Cotizacion } from './cotizacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//import { DatabaseService } from './db.service';
//import turnosQueries from './queries/turnos.queries';
//import { ResultSetHeader, RowDataPacket } from "mysql2";

// let cotizaciones: Cotizacion[] = [
//   {
//     id: 1,
//     empresa: 'XOM',
//     fecha: "01/10/2024",
//     hora: "17:28",
//     precioDolar: 35.27
//   }]

@Injectable()
export class CotizacionesService {

private cotizaciones: Cotizacion[] = [];

  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>) { }

  public async getAllCotizaciones(): Promise<Cotizacion[]> {
    console.log("Get AllCotizaciones");
    // const options: FindManyOptions = { relations: ['cotizaciones'] };
    // const empresas: Cotizacion[] = await this.cotizacionRepository.find(options);
    const cotizaciones: Cotizacion[] = await this.cotizacionRepository.find();
    return cotizaciones;
  }

}





