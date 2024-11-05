import {  Column, PrimaryGeneratedColumn, Entity } from "typeorm";
@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  private id: number;

  @Column({
    name: 'fecha',
    type: 'varchar',
    precision: 10,
  })
  private fecha: string;

  @Column({
    name: 'hora',
    type: 'varchar',
    precision: 5,
  })
  private hora: string;

  @Column({
    type: 'date',
  })
  private dateUTC: Date;

  @Column({
    name: 'cotization',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public cotization: number;

  @Column({
    name: 'codEmp',
    type: 'varchar',
    precision: 10,
  })
  private codEmp: string;




  constructor(fecha: string, hora: string, dateUTC: Date, cotization: number, codEmp: string) {
    this.fecha = fecha;
    this.hora = hora;
    this.dateUTC = dateUTC;
    this.cotization = cotization;
    this.codEmp = codEmp;

  }


}