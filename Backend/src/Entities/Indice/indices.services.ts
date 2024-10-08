import { Injectable } from '@nestjs/common';
import { Indice } from './indice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

//import { DatabaseService } from './db.service';
//import turnosQueries from './queries/turnos.queries';
//import { ResultSetHeader, RowDataPacket } from "mysql2";

// private Indices: IIndice[] = [
//   {
//     indiceID: 1,
//     nombreIndice: 'TSX',
//     paisIndice: "Canada",
//     empresasDelIndice: [],
//     valorDelIndice: 20254113,
//   }]

@Injectable()
export class IndicesService {

  private indices: Indice[] = [];

  constructor(
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>) { }

  // Obtener todos los Indices de los demas BOPAA
  public async getAllIndices(): Promise<Indice[]> {
    console.log("Get AllIndices");
    const options: FindManyOptions = { relations: ['empresas'] };
    const indices: Indice[] = await this.indiceRepository.find(options);
    return indices;
  }




}


