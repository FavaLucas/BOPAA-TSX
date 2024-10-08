import {  Column, JoinColumn, OneToMany, PrimaryGeneratedColumn, Entity } from "typeorm";
import { Empresa } from "../Empresa/empresa.entity";


@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn()
  private idCotizacion: number;

  @Column()
  private nombreCotizacion: string;

  @Column()
  private fechaCotizacion: string;

  @Column()
  private horaCotizacion: string;

  @Column()
  private precioDolar: number;

  @OneToMany(() => Empresa, (empresa) => empresa.cotizaciones)
  @JoinColumn()
  public empresas : Empresa[];




  constructor(idCotizacion: number, nombreCotizacion: string, fechaCotizacion: string, horaCotizacion: string, precioDolar: number) {

    this.idCotizacion = idCotizacion;
    this.nombreCotizacion = nombreCotizacion;
    this.fechaCotizacion = fechaCotizacion;
    this.horaCotizacion = horaCotizacion;
    this.precioDolar = precioDolar;
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