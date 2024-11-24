import { Entity, Column, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CotizacionIndice } from "../CotizacionIndice/cotizacionIndice.entity";

@Entity('indices')
export class Indice {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  public id: number;

  @Column({
    name: 'codigoIndice',
    type: "varchar",
    length: 10,
  })
  @Index() 
  public codigoIndice: string;

  @Column({
    name: 'nombreIndice',
    length: 100,
  })
  public nombreIndice: string;

  @Column({
    name: 'valorFinalIndice',
    type: 'bigint',
  })
  public valorFinalIndice: number;

  @OneToMany(() => CotizacionIndice, (cotizacion) => cotizacion.codigoIndice)
  public cotizaciones: CotizacionIndice[];

  constructor(codigoIndice: string, nombreIndice: string, valorFinalIndice: number) {
    this.codigoIndice = codigoIndice;
    this.nombreIndice = nombreIndice;
    this.valorFinalIndice = valorFinalIndice;
  }
}
