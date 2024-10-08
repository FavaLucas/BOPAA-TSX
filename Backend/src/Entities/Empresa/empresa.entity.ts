import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Indice } from "../Indice/indice.entity";
import { Cotizacion } from "../Cotizacion/cotizacion.entity";


@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  private idEmpresa: number;

  @Column()
  private nombreEmpresa: string;

  @Column()
  private abreviacion: string;

  @Column()
  private paisEmpresa: string;

  @Column()
  private bolsaEnQueCotiza: number;
  
  @ManyToOne(() => Indice, (indice) => indice.empresas)
  @JoinColumn({
    name: 'indiceID',
    foreignKeyConstraintName: 'FK_indiceEmpresa',
  })
  public indices: Indice;

  
  @ManyToOne(() => Cotizacion, (cotizacion) => cotizacion.empresas)
  @JoinColumn({
    name: 'iDCotizacion',
    foreignKeyConstraintName: 'FK_cotizacionEmpresa',
  })
  public cotizaciones: Cotizacion;

  constructor(idEmpresa: number, nombreEmpresa: string, abreviacion: string, paisEmpresa: string, bolsaEnQueCotiza: number) {

    this.idEmpresa = idEmpresa;
    this.nombreEmpresa = nombreEmpresa;
    this.abreviacion = abreviacion;
    this.paisEmpresa = paisEmpresa;
    this.bolsaEnQueCotiza = bolsaEnQueCotiza;
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