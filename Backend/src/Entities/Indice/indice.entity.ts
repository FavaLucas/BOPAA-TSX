import { Entity, Column, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CotizacionIndice } from "../CotizacionIndice/entities/cotizacionIndice.entity";

@Entity('indices')
export class Indice {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  private id: number;

  @Column({
    name: 'codigoIndice',
    length: 10,
  })
  private codigoIndice: string;

  @Column({
    name: 'nombreIndice',
    length: 100,
  })
  private nombreIndice: string;

  @Column({
    name: 'valorFinalIndice',
    type: 'bigint',
  })
  public valorFinalIndice: number;

  @OneToMany(() => CotizacionIndice, (cotizacion) => cotizacion.codigoIndice)
  public cotizaciones: CotizacionIndice[];


  constructor(id: number, codigoIndice: string, nombreIndice: string, valorFinalIndice: number) {
    this.id = id;
    this.codigoIndice = codigoIndice;
    this.nombreIndice = nombreIndice;
    this.valorFinalIndice = valorFinalIndice;
  }
};
