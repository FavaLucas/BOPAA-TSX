import {  Column, JoinColumn, OneToMany, PrimaryGeneratedColumn, Entity } from "typeorm";
import { Empresa } from "../Empresa/empresa.entity";


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
  public cotizacion: number;

  @Column()
  private idEmpresa: number;

  @OneToMany(() => Empresa, (empresa) => empresa.cotizaciones)
  @JoinColumn()
  public empresas : Empresa[];




  constructor(id: number, fecha: string, hora: string, dateUTC: Date, cotizacion: number, idEmpresa: number) {

    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.dateUTC = dateUTC;
    this.cotizacion = cotizacion;
    this.idEmpresa = idEmpresa;
  }

  // public getIndiceID(): number { return this.indiceID }
  // public setIndiceID(indiceID: number): void { this.indiceID = indiceID }

  // public getNombreIndice(): string { return this.nombreIndice }
  // public setNombreIndice(nombreIndice: string): void { this.nombreIndice = nombreIndice }

  // public getPaisIndice(): string { return this.paisIndice }
  // public setPaisIndice(paisIndice: string): void { this.paisIndice = paisIndice }

  // public getEmpresasIndice(): IEmpresa[] { return this.empresasDelIndice }
  // public setEmpresasIndice(empresasDelIndice: IEmpresa[]): void { this.empresasDelIndice = empresasDelIndice }

  // public getValorDelIndice(): number { return this.valorDelIndice }
  // public setValorDelIndice(valorDelIndice: number): void { this.valorDelIndice = valorDelIndice }
}