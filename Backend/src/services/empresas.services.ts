import { Body, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import Empresa from 'src/models/Empresa.dto';

//import { DatabaseService } from './db.service';
//import turnosQueries from './queries/turnos.queries';
//import { ResultSetHeader, RowDataPacket } from "mysql2";

let empresas: Empresa[] = [
  {
    id: 1,
    nombre: 'ExxonMobil Corpotation',
    abreviacion: "XOM",
    pais: "Estados Unidos",
    bolsaDeCotizacion: "Estados Unidos"
  }]

@Injectable()
export class EmpresasService {
  getEmpresas(): Empresa[] {
    return empresas;
  }
}