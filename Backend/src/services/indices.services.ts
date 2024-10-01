import { Body, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import Indice from 'src/models/Indice.dto';

//import { DatabaseService } from './db.service';
//import turnosQueries from './queries/turnos.queries';
//import { ResultSetHeader, RowDataPacket } from "mysql2";

let Indices: Indice[] = [
  {
    id: 1,
    nombre: 'TSX',
    pais: "Canada",
    empresas: ["XOM", "AMZN", "UNH"],
    valorDelIndice: 20254113
  }]

@Injectable()
export class IndicesService {
  getIndices(): Indice[] {
    return Indices;
  }
}