import { Body, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import Cotizacion from 'src/models/Cotizacion.dto';

//import { DatabaseService } from './db.service';
//import turnosQueries from './queries/turnos.queries';
//import { ResultSetHeader, RowDataPacket } from "mysql2";

let cotizaciones: Cotizacion[] = [
  {
    id: 1,
    empresa: 'XOM',
    fecha: "01/10/2024",
    hora: "17:28",
    precioDolar: 35.27
  }]

@Injectable()
export class CotizacionesService {
  getCotizaciones(): Cotizacion[] {
    return cotizaciones;
  }
}