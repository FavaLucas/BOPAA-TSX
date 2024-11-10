import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Indice } from "../Indice/indice.entity";
import { Cotizacion } from "../Cotizacion/cotizacion.entity";


@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id: number;

  @Column({
    name: 'codEmpresa',
    length: 100,
  })
  public codEmpresa: string;

  @Column({
    name: 'empresaNombre',
    length: 100,
  })
  public empresaNombre: string;

  @Column({
    name: 'cotizationInicial',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public cotizationInicial: number;

  @Column({
    name: 'cantidadAcciones',
    type: 'bigint',
  })
  public cantidadAcciones: number;

  @OneToMany(() => Cotizacion, (cotizacion) => cotizacion.codEmpresaFK)
  public cotizacionesFK: Cotizacion[];


  constructor(codEmpresa: string, empresaNombre: string, cotizationInicial: number, cantidadAcciones: number) {
    this.codEmpresa = codEmpresa;
    this.empresaNombre = empresaNombre;
    this.cotizationInicial = cotizationInicial;
    this.cantidadAcciones = cantidadAcciones;
  }

  public getId(): number {
    return this.id;
  }

  public getCodempresa(): string {
    return this.codEmpresa;
  }

  public setCodempresa(codEmpresa: string) {
    this.codEmpresa = codEmpresa;
  }

  public getEmpresaNombre(): string {
    return this.empresaNombre;
  }

  public setEmpresaNombre(empresaNombre: string) {
    this.empresaNombre = empresaNombre;
  }

  public getCotizacionInicial(): number {
    return this.cotizationInicial;
  }

  public getCantidadAcciones(): number {
    return this.cantidadAcciones;
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